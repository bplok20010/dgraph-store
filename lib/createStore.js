
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = createStore;

var _DGraphStore = _interopRequireDefault(require("./DGraphStore"));

function createStore(data, options) {
  return new _DGraphStore["default"](data, options);
}