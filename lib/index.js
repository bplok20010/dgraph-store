
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

_Object$defineProperty(exports, "cloneStore", {
  enumerable: true,
  get: function get() {
    return _cloneStore["default"];
  }
});

_Object$defineProperty(exports, "createStore", {
  enumerable: true,
  get: function get() {
    return _createStore["default"];
  }
});

exports["default"] = void 0;

var _DGraphStore = _interopRequireDefault(require("./DGraphStore"));

var _cloneStore = _interopRequireDefault(require("./cloneStore"));

var _createStore = _interopRequireDefault(require("./createStore"));

var _default = _DGraphStore["default"];
exports["default"] = _default;