
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = cloneStore;

function cloneStore(store) {
  var newStore = new store.constructor(store.toData(), store.options);
  return newStore;
}