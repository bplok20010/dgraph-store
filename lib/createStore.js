
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createStore;

var _DGraphStore = _interopRequireDefault(require("./DGraphStore"));

function createStore(data, options) {
  return new _DGraphStore["default"](data, options);
}