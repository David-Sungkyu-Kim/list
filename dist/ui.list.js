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
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./views_html/list.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./views_html/list.js":
/*!****************************!*\
  !*** ./views_html/list.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass List {\n  constructor() {\n    this.setVars();\n    this.registerEvents();\n    this.init();\n  }\n\n  setVars() {\n    this.originData = null;\n    this.channelIndex = null;\n    this.bFirst = null;\n    this.nSliceIndex = 0;\n    this.channelContainer = document.getElementById(\"channelList\");\n    this.blockContainer = document.getElementById(\"blockList\");\n    this.txContainer = document.querySelector(\"#transactionList ul\");\n    this.elLoader = document.querySelector('._loader');\n    this.btnMoreLocation = document.querySelector(\".area_block_list .scroll\");\n    this.btnMore = document.createElement('p');\n    this.btnMore.style.display = 'none';\n    this.btnMoreText = document.createTextNode('more');\n    this.btnMore.appendChild(this.btnMoreText);\n    this.btnMore.classList.add('btn', 'btn-outline-orange', 'btn-sm', 'btn_more');\n    this.btnMoreLocation.appendChild(this.btnMore);\n  }\n\n  registerEvents() {\n    this.channelContainer.addEventListener('click', ({target}) => {\n      const targetTagName = target.tagName;\n      if (targetTagName !== 'LI' && targetTagName !== 'A') return;\n    });\n\n    this.btnMore.addEventListener('click', () => {\n      this.nSliceIndex += 11;\n      this.addList();\n    });\n  }\n\n  // fetch\n  getData() {\n    const url = \"../resources/json/block.json\";\n    // const url = '${pageContext.request.contextPath}/json/block_graph.gbj';\n\n    fetch(url).then(function (response) {\n      // console.log('loading start...');\n      if (response.ok) {\n        return response.json();\n      } else {\n        return Promise.reject({\n          status: response.status,\n          statusText: response.statusText\n        });\n      }\n    }).then(function (responseData) {\n      // console.log(responseData);\n      // console.log('loading end...');\n      this.elLoader.style.display = 'none';\n      this.originData = responseData;\n      this.bFirst = true;\n      this.channelList(this.originData, 0);\n      this.blockInfo(this.originData[0].blks, 0);\n\n    }.bind(this)).catch(function (error) {\n      console.error(error);\n    });\n  }\n\n  init() {\n    this.getData();\n  }\n\n  channelList(data, index) {\n    const tmpl = data => this.tmplHtml`\n      ${data.map(v => this.tmplHtml`<li><a href=\"#\">${v.chname}</a></li>`)}\n    `;\n\n    const promise = new Promise(resolve =>{\n      for (let i = 0; i < data.length; i++) {\n        if (data[i].chname === '' && data[i].chname !== undefined) {\n          resolve(false);\n        } else {\n          resolve(true);\n        }\n      }\n    });\n\n    promise.then(result => {\n      this.channelContainer.innerHTML = '';\n\n      if (result === false) {\n        this.channelContainer.insertAdjacentHTML('beforeend', this.emptyList());\n        this.channelIndex = 0;\n      } else {\n        this.channelContainer.insertAdjacentHTML('beforeend', tmpl(data));\n        this.channelIndex = index;\n        const el = document.querySelectorAll('#channelList li');\n        this.setActive(el);\n      }\n      this.blockList(data, this.channelIndex);\n    });\n\n  }\n\n  blockList(data, index, boolean) {\n    const tmpl = insertData => this.tmplHtml`\n        ${insertData.map(v => this.tmplHtml`\n          <li>\n          <a href=\"#\"><i class=\"far fa-folder\"></i><i class=\"far fa-folder-open\"></i>\n            <div>\n              <table>\n                <tbody>\n                <tr>\n                  <th>block ID :</th>\n                  <td>$${v.blockId}</td>\n                </tr>\n                <tr>\n                  <th>Tx amount :</th>\n                  <td>$${v.tx_count}</td>\n                </tr>\n                </tbody>\n              </table>\n            <div>\n            </a>\n          </li>`)}`;\n\n    let insertData = data[index].blks.slice(this.nSliceIndex, this.nSliceIndex + 11);\n\n    if (data[index].blks.length > 0 && insertData.length <= 12 + index) {\n      if (boolean !== true || !boolean) this.blockContainer.innerHTML = '';\n\n      if (insertData.length >= 11) {\n        this.showBtnMore();\n      } else {\n        this.hideBtnMore();\n        this.nSliceIndex = 0;\n      }\n      this.blockContainer.insertAdjacentHTML('beforeend', tmpl(insertData));\n      const el = document.querySelectorAll('#blockList li');\n      this.setActive(el);\n    } else {\n      //empty data\n      this.blockContainer.insertAdjacentHTML('beforeend', this.emptyList());\n    }\n  }\n\n  blockInfo(data, blockIndex) {\n    const tmpl = insertData => this.tmplHtml`\n        ${insertData[blockIndex].detail.map(v => this.tmplHtml`\n          <li>\n          <table class=\"table table-bordered table-striped\">\n            <colgroup>\n              <col style=\"width: 30%;\">\n            </colgroup>\n            <tbody>\n            <tr>\n              <th>Function</th>\n              <td>${v.args[0]}</td>\n            </tr>\n            <tr>\n              <th>Argument</th>\n              <td>${v.args.slice(1,)}</td>\n            </tr>\n            <tr>\n              <th>Datetime</th>\n              <td>${v.datetime}</td>\n            </tr>\n            <tr>\n              <th>TxID</th>\n              <td>${v.tx_id}</td>\n            </tr>\n            </tbody>\n          </table>\n          </li>`)}`;\n\n    this.txContainer.innerHTML = '';\n    if (data.length > 0) {\n      this.txContainer.insertAdjacentHTML('beforeend', tmpl(data));\n    } else {\n      // empty data\n      this.txContainer.insertAdjacentHTML('beforeend', this.emptyList());\n    }\n  }\n\n  setActive(elements) {\n    const el = Array.from(elements);\n\n    if (this.bFirst === true && el[0].parentNode.className === 'box_channel_list') {\n      el[0].setAttribute('class', 'active');\n    } else {\n      if (this.bFirst === true) {\n        el[0].setAttribute('class', 'active');\n      }\n      this.bFirst = false;\n    }\n\n    const elementClick = (index) => {\n      el[index].addEventListener('click', () => {\n        for (let i = 0; i < el.length; i++) {\n          el[i].removeAttribute('class');\n        }\n\n        if (el[index].getAttribute('class') !== 'active') {\n          el[index].setAttribute('class', 'active');\n        } else return;\n\n        const className = el[index].parentNode.className;\n        switch (className) {\n          case 'box_channel_list':\n            this.bFirst = true;\n            this.channelIndex = index;\n            this.nSliceIndex = 0;\n            this.blockList(this.originData, index);\n            this.blockInfo(this.originData[index].blks, 0);\n            break;\n          case 'box_block_list':\n            this.blockInfo(this.originData[this.channelIndex].blks, index);\n            break;\n          default:\n            break;\n        }\n      });\n    };\n\n    for (let i = 0; i < el.length; i++) {\n      elementClick(i);\n    }\n  }\n\n  addList() {\n    const bAdd = true;\n    this.blockList(this.originData, this.channelIndex, bAdd);\n  }\n\n  tmplHtml(templateObject, ...substs) {\n    const raw = templateObject.raw;\n    let result = '';\n    substs.forEach((subst, i) => {\n      let lit = raw[i];\n      if (Array.isArray(subst)) {\n        subst = subst.join('');\n      }\n\n      if (lit.endsWith('$')) {\n        if (typeof subst === 'string') subst = this.htmlEscape(subst);\n        lit = lit.slice(0, -1);\n      }\n      result += lit;\n      result += subst;\n    });\n    result += raw[raw.length - 1];\n    return result;\n  }\n\n  htmlEscape(str) {\n    return str.replace(/&/g, '&amp;')\n      .replace(/>/g, '&gt;')\n      .replace(/</g, '&lt;')\n      .replace(/\"/g, '&quot;')\n      .replace(/'/g, '&#39;')\n      .replace(/`/g, '&#96;');\n  }\n\n  emptyList(){\n    return `<li class=\"txt_no_data\">\n              <p>No data available</p>\n              <span class=\"fas fa-database\"></span>\n            </li>`;\n  }\n\n  showBtnMore() {\n    this.btnMore.style.display = 'block';\n  }\n\n  hideBtnMore() {\n    this.btnMore.style.display = 'none';\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (List);\n\nconst myList = new List();\n\n//# sourceURL=webpack:///./views_html/list.js?");

/***/ })

/******/ });