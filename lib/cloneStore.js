
"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = cloneStore;

function cloneStore(store) {
  var newStore = new store.constructor(store.toData(), store.options);
  return newStore;
}