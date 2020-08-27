import { TSMap } from "typescript-map"


export class PackerInfo
{
	public version: Number = 1;
	public encrypt: Boolean = false;
}
(window as any).PackerInfo = PackerInfo;

export class ContentFileInfo
{ 
	public p: string;
	public o: number;
	public s: number;
	public f: number;

	constructor(_file: File, startOffsetWithoutOrigin: number)
	constructor(_file: [string, ArrayBuffer], startOffsetWithoutOrigin: number)
	constructor(_file: any, startOffsetWithoutOrigin: number)
	{
		if(_file instanceof File)
		{
			let file = _file as File;
			this.p = file.name;
			this.o = startOffsetWithoutOrigin;
			this.s = this.f = file.size;
		}
		else
		{
			let [name, bin] = _file as [string, ArrayBuffer];
			this.p = name;
			this.o = startOffsetWithoutOrigin;
			this.s = this.f = bin.byteLength;
		}
	}
}
(window as any).ContentFileInfo = ContentFileInfo;

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
(window as any).ImageIndex = ImageIndex;

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
(window as any).ActionData = ActionData;

export class MetaData extends TSMap<string, any>
{
	constructor(
		name: string, displayName: MultiLanguageText, displayDescription: MultiLanguageText, copyrights: string[],
		imageFiles: File[], imageSize: number[], actions: ActionData[], defaultAction: string, initialAction: string)
	{
		super();
		if(!displayName) return;

		this.set("uk", name);
		this.set("display-name", displayName);
		this.set("display-desc", displayDescription);
		this.set("copyrights", copyrights);
		this.set("image-files", Array.from(imageFiles).map((e, i, a) => e.name));
		this.set("image-size", imageSize);
		this.set("default-action", defaultAction);
		this.set("initial-action", initialAction);
		this.set("actions", actions);
	}

	public async loadThumbnail(thumbnailFile: File)
	{
		let reader = new FileReader();
		let promise = new Promise(r => reader.addEventListener("load", () => r()));
		reader.readAsDataURL(thumbnailFile);
		await promise;
		let url = reader.result as string;
		this.set("thumbnail-img", url.replace("data:image/png;base64,", ""));
	}
}
(window as any).MetaData = MetaData;

export class RSPObject
{
	INFO_JSON_FILE_NAME: string = "info.json";
	RSP_SIGNATURE: Uint8Array = new Uint8Array([0x52, 0x53, 0x70, 0x65, 0x61, 0x6B, 0x65, 0x72]); // "RSpeaker"

	public packerInfo: PackerInfo = new PackerInfo();
	public contentFileInfos: ContentFileInfo[] = [];
	public metaData?: MetaData;
	public contents: Map<string, [ArrayBuffer, any]> = new Map<string, [ArrayBuffer, any]>();

	public async init(name: string, displayName: MultiLanguageText, displayDescription: MultiLanguageText, copyrights: string[],
		thumbnailFile: File, imageFiles: File[],
		actions: ActionData[], defaultAction: string, initialAction: string) : Promise<any>
	{
		let offset = 0;

		
		this.metaData = new MetaData(
			name, displayName, displayDescription, copyrights,
			imageFiles, await RSPObject.getImageSize(imageFiles[0]),
			actions, defaultAction, initialAction);
		await this.metaData.loadThumbnail(thumbnailFile);

		let bin = RSPObject.toByte(this.metaData);
		this.contents.set(this.INFO_JSON_FILE_NAME, [bin, this.metaData]);
		this.contentFileInfos.push(new ContentFileInfo([this.INFO_JSON_FILE_NAME, bin], 0));
		offset += this.contents.get(this.INFO_JSON_FILE_NAME)?.[0].byteLength as number;

		for (let i = 0; i < imageFiles.length; i++)
		{
			let image = imageFiles[i];
			let fileName = image.name;
			var buff = await image.arrayBuffer();
			this.contents.set(image.name, [buff, null]);
			this.contentFileInfos.push(new ContentFileInfo(image, offset));
			offset += this.contents.get(fileName)?.[0].byteLength as number;
		}
	}

	public save(name: string) : File
	{
		let packerInfoBin = RSPObject.toByte(this.packerInfo);
		let packerInfoBinSizeBuff = new ArrayBuffer(4);
		new DataView(packerInfoBinSizeBuff).setUint32(0, packerInfoBin.byteLength, true);

		let contentFileInfoBin = RSPObject.toByte(this.contentFileInfos);
		let contentFileInfoBinSizeBuff = new ArrayBuffer(4);
		new DataView(contentFileInfoBinSizeBuff).setUint32(0, contentFileInfoBin.byteLength, true);

		let contentFileInfoBins = Array.from(this.contents.values()).map(t => t[0]);
		let contentFileInfoBinsSizeBuff = new ArrayBuffer(8);
		let totalSize = contentFileInfoBins.map(e => e.byteLength).reduce((a, b) => a + b);
		new DataView(contentFileInfoBinsSizeBuff).setUint32(0, totalSize, true); // 4.2GBの壁あり

		let file = new File([
			this.RSP_SIGNATURE,
			packerInfoBinSizeBuff, packerInfoBin,
			contentFileInfoBinSizeBuff, contentFileInfoBin,
			contentFileInfoBinsSizeBuff].concat(contentFileInfoBins), name);
		return file;
	}

	static async getImageSize(file: File) : Promise<number[]>
	{
		let image = new Image();
		let promise = new Promise(r => image.onload = () => r());
		image.src = URL.createObjectURL(file);
		await promise;
		return [image.naturalWidth, image.naturalHeight];
	}

	static toByte(graph: any): Uint8Array
	{
		let json = JSON.stringify(graph);
		return new TextEncoder().encode(json);
	}
}
(window as any).RSPObject = RSPObject;