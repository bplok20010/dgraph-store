
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Cache =
/*#__PURE__*/
function () {
  function Cache() {
    (0, _classCallCheck2["default"])(this, Cache);
    (0, _defineProperty2["default"])(this, "_caches", Object.create(null));
  }

  (0, _createClass2["default"])(Cache, [{
    key: "set",
    value: function set(key, value) {
      this._caches[key] = value;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._caches[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return key in this._caches;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      delete this._caches[key];
    }
  }, {
    key: "clear",
    value: function clear() {
      this._caches = Object.create(null);
    }
  }]);
  return Cache;
}();

exports["default"] = Cache;