/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/RSPObject.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/typescript-map/index.js":
/*!**********************************************!*\
  !*** ./node_modules/typescript-map/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar TSMap = /** @class */ (function () {\n    function TSMap(inputMap) {\n        var t = this;\n        t._keys = [];\n        t._values = [];\n        t.length = 0;\n        if (inputMap) {\n            inputMap.forEach(function (v, k) {\n                t.set(v[0], v[1]);\n            });\n        }\n    }\n    /**\n     * Convert a JSON object to a map.\n     *\n     * @param {*} jsonObject JSON object to convert\n     * @param {boolean} [convertObjs] convert nested objects to maps\n     * @returns {TSMap<K, V>}\n     * @memberof TSMap\n     */\n    TSMap.prototype.fromJSON = function (jsonObject, convertObjs) {\n        var t = this;\n        var setProperty = function (value) {\n            if (value !== null && typeof value === 'object' && convertObjs)\n                return new TSMap().fromJSON(value, true);\n            if (Array.isArray(value) && convertObjs)\n                return value.map(function (v) { return setProperty(v); });\n            return value;\n        };\n        Object.keys(jsonObject).forEach(function (property) {\n            if (jsonObject.hasOwnProperty(property)) {\n                t.set(property, setProperty(jsonObject[property]));\n            }\n        });\n        return t;\n    };\n    /**\n     * Outputs the contents of the map to a JSON object\n     *\n     * @returns {{[key: string]: V}}\n     * @memberof TSMap\n     */\n    TSMap.prototype.toJSON = function () {\n        var obj = {};\n        var t = this;\n        var getValue = function (value) {\n            if (value instanceof TSMap) {\n                return value.toJSON();\n            }\n            else if (Array.isArray(value)) {\n                return value.map(function (v) { return getValue(v); });\n            }\n            else {\n                return value;\n            }\n        };\n        t.keys().forEach(function (k) {\n            obj[String(k)] = getValue(t.get(k));\n        });\n        return obj;\n    };\n    /**\n     * Get an array of arrays respresenting the map, kind of like an export function.\n     *\n     * @returns {(Array<Array<K|V>>)}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.entries = function () {\n        var _this = this;\n        return [].slice.call(this.keys().map(function (k) { return [k, _this.get(k)]; }));\n    };\n    /**\n     * Get an array of keys in the map.\n     *\n     * @returns {Array<K>}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.keys = function () {\n        return [].slice.call(this._keys);\n    };\n    /**\n     * Get an array of the values in the map.\n     *\n     * @returns {Array<V>}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.values = function () {\n        return [].slice.call(this._values);\n    };\n    /**\n     * Check to see if an item in the map exists given it's key.\n     *\n     * @param {K} key\n     * @returns {Boolean}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.has = function (key) {\n        return this._keys.indexOf(key) > -1;\n    };\n    /**\n     * Get a specific item from the map given it's key.\n     *\n     * @param {K} key\n     * @returns {V}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.get = function (key) {\n        var i = this._keys.indexOf(key);\n        return i > -1 ? this._values[i] : undefined;\n    };\n    /**\n     * Safely retrieve a deeply nested property.\n     *\n     * @param {K[]} path\n     * @returns {V}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.deepGet = function (path) {\n        if (!path || !path.length)\n            return null;\n        var recursiveGet = function (obj, path) {\n            if (obj === undefined || obj === null)\n                return null;\n            if (!path.length)\n                return obj;\n            return recursiveGet(obj instanceof TSMap ? obj.get(path[0]) : obj[path[0]], path.slice(1));\n        };\n        return recursiveGet(this.get(path[0]), path.slice(1));\n    };\n    /**\n     * Set a specific item in the map given it's key, automatically adds new items as needed.\n     * Ovewrrites existing items\n     *\n     * @param {K} key\n     * @param {V} value\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.set = function (key, value) {\n        var t = this;\n        // check if key exists and overwrite\n        var i = this._keys.indexOf(key);\n        if (i > -1) {\n            t._values[i] = value;\n        }\n        else {\n            t._keys.push(key);\n            t._values.push(value);\n            t.length = t._values.length;\n        }\n        return this;\n    };\n    /**\n     * Enters a value into the map forcing the keys to always be sorted.\n     * Stolen from https://machinesaredigging.com/2014/04/27/binary-insert-how-to-keep-an-array-sorted-as-you-insert-data-in-it/\n     * Best case speed is O(1), worse case is O(N).\n     *\n     * @param {K} key\n     * @param {V} value\n     * @param {number} [startVal]\n     * @param {number} [endVal]\n     * @returns {this}\n     * @memberof TSMap\n     */\n    TSMap.prototype.sortedSet = function (key, value, startVal, endVal) {\n        var t = this;\n        var length = this._keys.length;\n        var start = startVal || 0;\n        var end = endVal !== undefined ? endVal : length - 1;\n        if (length == 0) {\n            t._keys.push(key);\n            t._values.push(value);\n            return t;\n        }\n        if (key == this._keys[start]) {\n            this._values.splice(start, 0, value);\n            return this;\n        }\n        if (key == this._keys[end]) {\n            this._values.splice(end, 0, value);\n            return this;\n        }\n        if (key > this._keys[end]) {\n            this._keys.splice(end + 1, 0, key);\n            this._values.splice(end + 1, 0, value);\n            return this;\n        }\n        if (key < this._keys[start]) {\n            this._values.splice(start, 0, value);\n            this._keys.splice(start, 0, key);\n            return this;\n        }\n        if (start >= end) {\n            return this;\n        }\n        var m = start + Math.floor((end - start) / 2);\n        if (key < this._keys[m]) {\n            return this.sortedSet(key, value, start, m - 1);\n        }\n        if (key > this._keys[m]) {\n            return this.sortedSet(key, value, m + 1, end);\n        }\n        return this;\n    };\n    /**\n     * Provide a number representing the number of items in the map\n     *\n     * @returns {number}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.size = function () {\n        return this.length;\n    };\n    /**\n     * Clear all the contents of the map\n     *\n     * @returns {TSMap<K,V>}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.clear = function () {\n        var t = this;\n        t._keys.length = t.length = t._values.length = 0;\n        return this;\n    };\n    /**\n     * Delete an item from the map given it's key\n     *\n     * @param {K} key\n     * @returns {Boolean}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.delete = function (key) {\n        var t = this;\n        var i = t._keys.indexOf(key);\n        if (i > -1) {\n            t._keys.splice(i, 1);\n            t._values.splice(i, 1);\n            t.length = t._keys.length;\n            return true;\n        }\n        return false;\n    };\n    /**\n     * Used to loop through the map.\n     *\n     * @param {(value:V,key?:K,index?:number) => void} callbackfn\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.forEach = function (callbackfn) {\n        var _this = this;\n        this._keys.forEach(function (v, i) {\n            callbackfn(_this.get(v), v, i);\n        });\n    };\n    /**\n     * Returns an array containing the returned value of each item in the map.\n     *\n     * @param {(value:V,key?:K,index?:number) => any} callbackfn\n     * @returns {Array<any>}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.map = function (callbackfn) {\n        var _this = this;\n        return this.keys().map(function (itemKey, i) {\n            return callbackfn(_this.get(itemKey), itemKey, i);\n        });\n    };\n    /**\n     * Removes items based on a conditional function passed to filter.\n     * Mutates the map in place.\n     *\n     * @param {(value:V,key?:K,index?:number) => Boolean} callbackfn\n     * @returns {TSMap<K,V>}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.filter = function (callbackfn) {\n        var t = this;\n        t._keys.slice().forEach(function (v, i) {\n            if (callbackfn(t.get(v), v, i) === false)\n                t.delete(v);\n        });\n        return this;\n    };\n    /**\n     * Creates a deep copy of the map, breaking all references to the old map and it's children.\n     * Uses JSON.parse so any functions will be stringified and lose their original purpose.\n     *\n     * @returns {TSMap<K,V>}\n     *\n     * @memberOf TSMap\n     */\n    TSMap.prototype.clone = function () {\n        return new TSMap(this.entries());\n    };\n    return TSMap;\n}());\nexports.TSMap = TSMap;\n\n\n//# sourceURL=webpack:///./node_modules/typescript-map/index.js?");

/***/ }),

/***/ "./src/RSPObject.ts":
/*!**************************!*\
  !*** ./src/RSPObject.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.RSPObject = exports.MetaData = exports.ActionData = exports.ImageIndex = exports.MultiLanguageText = exports.ContentFileInfo = exports.PackerInfo = void 0;\r\nconst typescript_map_1 = __webpack_require__(/*! typescript-map */ \"./node_modules/typescript-map/index.js\");\r\nclass PackerInfo {\r\n    constructor() {\r\n        this.version = 1;\r\n        this.encrypt = false;\r\n    }\r\n}\r\nexports.PackerInfo = PackerInfo;\r\nwindow.PackerInfo = PackerInfo;\r\nclass ContentFileInfo {\r\n    constructor(_file, startOffsetWithoutOrigin) {\r\n        if (_file instanceof File) {\r\n            let file = _file;\r\n            this.p = file.name;\r\n            this.o = startOffsetWithoutOrigin;\r\n            this.s = this.f = file.size;\r\n        }\r\n        else {\r\n            let [name, bin] = _file;\r\n            this.p = name;\r\n            this.o = startOffsetWithoutOrigin;\r\n            this.s = this.f = bin.byteLength;\r\n        }\r\n    }\r\n}\r\nexports.ContentFileInfo = ContentFileInfo;\r\nwindow.ContentFileInfo = ContentFileInfo;\r\nclass MultiLanguageText {\r\n    constructor(en, ja) {\r\n        this.en = en;\r\n        this.ja = ja;\r\n    }\r\n}\r\nexports.MultiLanguageText = MultiLanguageText;\r\nwindow.MultiLanguageText = MultiLanguageText;\r\nclass ImageIndex {\r\n    constructor(index) {\r\n        this.index = index;\r\n    }\r\n}\r\nexports.ImageIndex = ImageIndex;\r\nwindow.ImageIndex = ImageIndex;\r\nclass ActionData extends typescript_map_1.TSMap {\r\n    constructor(name, displayName, openMouse, closeMouse = null, closeEye = null) {\r\n        super();\r\n        closeMouse = closeMouse !== null && closeMouse !== void 0 ? closeMouse : openMouse; // 口閉じ差分無し\r\n        closeEye = closeEye !== null && closeEye !== void 0 ? closeEye : openMouse; // 目閉じ差分なし\r\n        // 目閉じ＋口閉じは？？？\r\n        this.set(\"name\", name);\r\n        this.set(\"display-name\", displayName);\r\n        this.set(\"n\", new ImageIndex(openMouse));\r\n        this.set(\"o\", new ImageIndex(closeMouse));\r\n        this.set(\"c\", new ImageIndex(closeEye));\r\n    }\r\n}\r\nexports.ActionData = ActionData;\r\nwindow.ActionData = ActionData;\r\nclass MetaData extends typescript_map_1.TSMap {\r\n    constructor(name, displayName, displayDescription, copyrights, imageFiles, imageSize, actions, defaultAction, initialAction) {\r\n        super();\r\n        if (!displayName)\r\n            return;\r\n        this.set(\"uk\", name);\r\n        this.set(\"display-name\", displayName);\r\n        this.set(\"display-desc\", displayDescription);\r\n        this.set(\"copyrights\", copyrights);\r\n        this.set(\"image-files\", Array.from(imageFiles).map((e, i, a) => e.name));\r\n        this.set(\"image-size\", imageSize);\r\n        this.set(\"default-action\", defaultAction);\r\n        this.set(\"initial-action\", initialAction);\r\n        this.set(\"actions\", actions);\r\n    }\r\n    async loadThumbnail(thumbnailFile) {\r\n        let reader = new FileReader();\r\n        let promise = new Promise(r => reader.addEventListener(\"load\", () => r()));\r\n        reader.readAsDataURL(thumbnailFile);\r\n        await promise;\r\n        let url = reader.result;\r\n        this.set(\"thumbnail-img\", url.replace(\"data:image/png;base64,\", \"\"));\r\n    }\r\n}\r\nexports.MetaData = MetaData;\r\nwindow.MetaData = MetaData;\r\nclass RSPObject {\r\n    constructor() {\r\n        this.INFO_JSON_FILE_NAME = \"info.json\";\r\n        this.RSP_SIGNATURE = new Uint8Array([0x52, 0x53, 0x70, 0x65, 0x61, 0x6B, 0x65, 0x72]); // \"RSpeaker\"\r\n        this.packerInfo = new PackerInfo();\r\n        this.contentFileInfos = [];\r\n        this.contents = new Map();\r\n    }\r\n    async init(name, displayName, displayDescription, copyrights, thumbnailFile, imageFiles, actions, defaultAction, initialAction) {\r\n        var _a, _b;\r\n        let offset = 0;\r\n        this.metaData = new MetaData(name, displayName, displayDescription, copyrights, imageFiles, await RSPObject.getImageSize(imageFiles[0]), actions, defaultAction, initialAction);\r\n        await this.metaData.loadThumbnail(thumbnailFile);\r\n        let bin = RSPObject.toByte(this.metaData);\r\n        this.contents.set(this.INFO_JSON_FILE_NAME, [bin, this.metaData]);\r\n        this.contentFileInfos.push(new ContentFileInfo([this.INFO_JSON_FILE_NAME, bin], 0));\r\n        offset += (_a = this.contents.get(this.INFO_JSON_FILE_NAME)) === null || _a === void 0 ? void 0 : _a[0].byteLength;\r\n        for (let i = 0; i < imageFiles.length; i++) {\r\n            let image = imageFiles[i];\r\n            let fileName = image.name;\r\n            var buff = await image.arrayBuffer();\r\n            this.contents.set(image.name, [buff, null]);\r\n            this.contentFileInfos.push(new ContentFileInfo(image, offset));\r\n            offset += (_b = this.contents.get(fileName)) === null || _b === void 0 ? void 0 : _b[0].byteLength;\r\n        }\r\n    }\r\n    save(name) {\r\n        let packerInfoBin = RSPObject.toByte(this.packerInfo);\r\n        let packerInfoBinSizeBuff = new ArrayBuffer(4);\r\n        new DataView(packerInfoBinSizeBuff).setUint32(0, packerInfoBin.byteLength, true);\r\n        let contentFileInfoBin = RSPObject.toByte(this.contentFileInfos);\r\n        let contentFileInfoBinSizeBuff = new ArrayBuffer(4);\r\n        new DataView(contentFileInfoBinSizeBuff).setUint32(0, contentFileInfoBin.byteLength, true);\r\n        let contentFileInfoBins = Array.from(this.contents.values()).map(t => t[0]);\r\n        let contentFileInfoBinsSizeBuff = new ArrayBuffer(8);\r\n        let totalSize = contentFileInfoBins.map(e => e.byteLength).reduce((a, b) => a + b);\r\n        new DataView(contentFileInfoBinsSizeBuff).setUint32(0, totalSize, true); // 4.2GBの壁あり\r\n        let file = new File([\r\n            this.RSP_SIGNATURE,\r\n            packerInfoBinSizeBuff, packerInfoBin,\r\n            contentFileInfoBinSizeBuff, contentFileInfoBin,\r\n            contentFileInfoBinsSizeBuff\r\n        ].concat(contentFileInfoBins), name);\r\n        return file;\r\n    }\r\n    static async getImageSize(file) {\r\n        let image = new Image();\r\n        let promise = new Promise(r => image.onload = () => r());\r\n        image.src = URL.createObjectURL(file);\r\n        await promise;\r\n        return [image.naturalWidth, image.naturalHeight];\r\n    }\r\n    static toByte(graph) {\r\n        let json = JSON.stringify(graph);\r\n        return new TextEncoder().encode(json);\r\n    }\r\n}\r\nexports.RSPObject = RSPObject;\r\nwindow.RSPObject = RSPObject;\r\n\n\n//# sourceURL=webpack:///./src/RSPObject.ts?");

/***/ })

/******/ });