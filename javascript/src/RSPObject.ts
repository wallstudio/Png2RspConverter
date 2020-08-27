import { TSMap } from "typescript-map"

function distinct<T>(array: T[], hashSelector: (item: T) => string) : T[]
{
	const buff = new Array<T>();
	for (const item of array)
	{
		if(buff.length == 0)
		{
			buff.push(item);
			continue;
		}
		for (const inBuff of buff)
		{
			if(hashSelector(item) != hashSelector(inBuff))
			{
				buff.push(item);
			}	
		}
	}
	return buff;
}

export class PackerInfo
{
	public version: Number = 1;
	public encrypt: Boolean = false;
}

export class ContentFileInfo
{ 
	public p: string;
	public o: number;
	public s: number;
	public f: number;

	constructor(_file: [string, ArrayBuffer], startOffsetWithoutOrigin: number)
	{
		const [name, bin] = _file as [string, ArrayBuffer];
		this.p = name;
		this.o = startOffsetWithoutOrigin;
		this.s = this.f = bin.byteLength;
	}
}

export class MultiLanguageText
{
	public en: string;
	public ja: string;
	
	constructor(en: string, ja: string)
	{
		this.en = en;
		this.ja = ja;
	}
}
(window as any).MultiLanguageText = MultiLanguageText;

export class ImageIndex
{
	public index: number;

	constructor(index: number)
	{
		this.index = index;
	}
}

export class ActionData extends TSMap<string, any>
{
	constructor(name: string, displayName: MultiLanguageText, openMouse: number, closeMouse: number | null = null, closeEye: number | null = null)
	{
		super();

		closeMouse = closeMouse ?? openMouse; // 口閉じ差分無し
		closeEye = closeEye ?? openMouse; // 目閉じ差分なし
		// 目閉じ＋口閉じは？？？

		this.set("name", name);
		this.set("display-name", displayName);
		this.set("n", new ImageIndex(openMouse));
		this.set("o", new ImageIndex(closeMouse));
		this.set("c", new ImageIndex(closeEye));
	}
}

export class MetaData extends TSMap<string, any>
{
	constructor(
		name: string, displayName: MultiLanguageText, displayDescription: MultiLanguageText, copyrights: string[],
		imageFiles: [string, ArrayBuffer][], imageSize: number[], actions: ActionData[], defaultAction: string, initialAction: string)
	{
		super();
		if(!displayName) return;

		this.set("uk", name);
		this.set("display-name", displayName);
		this.set("display-desc", displayDescription);
		this.set("copyrights", copyrights);
		this.set("image-files", Array.from(imageFiles).map(img => img[0]));
		this.set("image-size", imageSize);
		this.set("default-action", defaultAction);
		this.set("initial-action", initialAction);
		this.set("actions", actions);
	}

	public async loadThumbnail(thumbnailFile: File)
	{
		const reader = new FileReader();
		const promise = new Promise(r => reader.addEventListener("load", () => r()));
		reader.readAsDataURL(thumbnailFile);
		await promise;
		const url = reader.result as string;
		this.set("thumbnail-img", url.replace("data:image/png;base64,", ""));
	}
}

export class ActionInfo
{
	name: string;
	displayName: MultiLanguageText;
	openMouse: File;
	closeMouse: File;
	closeEye: File;

	constructor(name: string, displayName: MultiLanguageText, openMouse: File, closeMouse: File | null = null, closeEye: File | null = null)
	{
		this.name = name;
		this.displayName = displayName;
		this.openMouse = openMouse;
		this.closeMouse = closeMouse ?? openMouse;
		this.closeEye = closeEye ?? openMouse;
	}

	public async getActionData(actionIndex: number) : Promise<[ActionData, [string, ArrayBuffer][]]>
	{
		const action = new ActionData(this.name, this.displayName, actionIndex * 3, actionIndex * 3 + 1, actionIndex * 3 + 2);
		const files = [this.openMouse, this.closeMouse, this.closeEye];
		const namedBuffers = files.map<Promise<[string, ArrayBuffer]>>(async (f, i) => [`${this.name}_${i}__${f.name}`, await f.arrayBuffer()]); // 強制敵にユニークにする
		return [action, await Promise.all(namedBuffers)];
	}

	public async getImageSize() : Promise<[number, number]>
	{
		const files = [this.openMouse, this.closeMouse, this.closeEye];
		const sizes = distinct(await Promise.all(files.map(async f =>
		{
			const image = new Image();
			const promise = new Promise(r => image.onload = () => r());
			image.src = URL.createObjectURL(f);
			await promise;
			const size = [image.naturalWidth, image.naturalHeight];
			URL.revokeObjectURL(image.src);
			return size;
		})), JSON.stringify);
		if(sizes.length != 1) throw new Error(`異なる画像サイズの混在 ${name} ${Array.from(sizes).join("|")}`)
		return sizes.values().next().value;
	}
} 
(window as any).ActionInfo = ActionInfo;

export class RSPObject
{

	INFO_JSON_FILE_NAME: string = "info.json";
	RSP_SIGNATURE: Uint8Array = new Uint8Array([0x52, 0x53, 0x70, 0x65, 0x61, 0x6B, 0x65, 0x72]); // "RSpeaker"

	public packerInfo: PackerInfo = new PackerInfo();
	public contentFileInfos: ContentFileInfo[] = [];
	public metaData?: MetaData;
	public contents: Map<string, [ArrayBuffer, any]> = new Map<string, [ArrayBuffer, any]>();

	public async init(name: string, displayName: MultiLanguageText, displayDescription: MultiLanguageText, copyrights: string[], thumbnailFile: File,
		defaultAction: ActionInfo, initialAction: ActionInfo | null, otherActions: ActionInfo[]) : Promise<any>
	{
		let offset = 0;

		let actionInfos = [];
		actionInfos.push(defaultAction);
		if(initialAction)
		{
			actionInfos.push(initialAction);
		}
		actionInfos = actionInfos.concat(otherActions);

		// calc size
		actionInfos.forEach((act, i) => act.name = `${name}_${i}__${act.name}`); // 強制敵にユニークにする
		const sizes = distinct(await Promise.all(actionInfos.map(async a => await a.getImageSize())), JSON.stringify);
		if(sizes.length != 1) throw new Error(`異なる画像サイズの混在 ${Array.from(sizes).join("|")}`);
		const size = sizes.values().next().value;

		// meta json
		const actionsAndImages = await Promise.all(actionInfos.map((act, i) => act.getActionData(i)));
		this.metaData = new MetaData(
			name, displayName, displayDescription, copyrights,
			actionsAndImages.flatMap(ai => ai[1]), size,
			actionsAndImages.map(ai => ai[0]), defaultAction.name, (initialAction ?? defaultAction).name);
		await this.metaData.loadThumbnail(thumbnailFile);

		const metaBin = RSPObject.toByte(this.metaData);
		this.contents.set(this.INFO_JSON_FILE_NAME, [metaBin, this.metaData]);
		this.contentFileInfos.push(new ContentFileInfo([this.INFO_JSON_FILE_NAME, metaBin], 0));
		offset += this.contents.get(this.INFO_JSON_FILE_NAME)?.[0].byteLength as number;

		// images
		for (const [name, buff] of actionsAndImages.flatMap(ai => ai[1]))
		{
			this.contents.set(name, [buff, null]);
			this.contentFileInfos.push(new ContentFileInfo([name, buff], offset));
			offset += this.contents.get(name)?.[0].byteLength as number;
		}
	}

	public save(name: string) : File
	{
		const packerInfoBin = RSPObject.toByte(this.packerInfo);
		const packerInfoBinSizeBuff = new ArrayBuffer(4);
		new DataView(packerInfoBinSizeBuff).setUint32(0, packerInfoBin.byteLength, true);

		const contentFileInfoBin = RSPObject.toByte(this.contentFileInfos);
		const contentFileInfoBinSizeBuff = new ArrayBuffer(4);
		new DataView(contentFileInfoBinSizeBuff).setUint32(0, contentFileInfoBin.byteLength, true);

		const contentFileInfoBins = Array.from(this.contents.values()).map(t => t[0]);
		const contentFileInfoBinsSizeBuff = new ArrayBuffer(8);
		const totalSize = contentFileInfoBins.map(e => e.byteLength).reduce((a, b) => a + b);
		new DataView(contentFileInfoBinsSizeBuff).setUint32(0, totalSize, true); // 4.2GBの壁あり

		const file = new File([
			this.RSP_SIGNATURE,
			packerInfoBinSizeBuff, packerInfoBin,
			contentFileInfoBinSizeBuff, contentFileInfoBin,
			contentFileInfoBinsSizeBuff].concat(contentFileInfoBins), name);
		return file;
	}

	static toByte(graph: any): Uint8Array
	{
		const json = JSON.stringify(graph);
		return new TextEncoder().encode(json);
	}
}
(window as any).RSPObject = RSPObject;

async function TestRSPObject()
{
	const rsp = new RSPObject();
	await rsp.init(
		"2D-VFlower", // name: string,
		new MultiLanguageText("2D-v_flower", "2D-花ちゃん"), // displayName: MultiLanguageText,
		new MultiLanguageText("_", "うぷはしのテスト！"), // displayDescription: MultiLanguageText,
		["うぷはし"], // copyrights: string[],
		(new Object as File), // thumbnailFile: File,
		new ActionInfo("kiri", new MultiLanguageText("kiri", "キリッ"), (new Object as File), (new Object as File), (new Object as File)),
		new ActionInfo("aho", new MultiLanguageText("aho", "あほ"), (new Object as File), (new Object as File)),
		[
			new ActionInfo("normal", new MultiLanguageText("normal", "ノーマル"), (new Object as File)),
			new ActionInfo("normal2", new MultiLanguageText("normal2", "ノーマル2"), (new Object as File)),
		]);
	let file = rsp.save("hoge.rsp");
};