
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptors"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptor"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/get-own-property-symbols"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/keys"));

var _create = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/create"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/defineProperty"));

var _cloneStore = _interopRequireDefault(require("./cloneStore"));

function ownKeys(object, enumerableOnly) { var keys = (0, _keys["default"])(object); if (_getOwnPropertySymbols["default"]) { var symbols = (0, _getOwnPropertySymbols["default"])(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return (0, _getOwnPropertyDescriptor["default"])(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty3["default"])(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors["default"]) { (0, _defineProperties["default"])(target, (0, _getOwnPropertyDescriptors["default"])(source)); } else { ownKeys(source).forEach(function (key) { (0, _defineProperty2["default"])(target, key, (0, _getOwnPropertyDescriptor["default"])(source, key)); }); } } return target; }

var DGraphStore =
/*#__PURE__*/
function () {
  // Array<Node>
  // Array<Edge>
  // Object<String, String>
  // Object<String, String>
  // Object<String, String>
  // _cache = new Cache();

  /**
   *Creates an instance of DGraphStore.
   * @param {Object} data
   * @param {Array} data.nodes
   * @param {Array} data.edges
   * @param {Object} options
   * @memberof DGraphStore
   */
  function DGraphStore(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2["default"])(this, DGraphStore);
    (0, _defineProperty3["default"])(this, "options", {});
    (0, _defineProperty3["default"])(this, "__NodeList", []);
    (0, _defineProperty3["default"])(this, "__EdgeList", []);
    (0, _defineProperty3["default"])(this, "__NodeMap", (0, _create["default"])(null));
    (0, _defineProperty3["default"])(this, "__NodeParentMap", (0, _create["default"])(null));
    (0, _defineProperty3["default"])(this, "__NodeChildMap", (0, _create["default"])(null));
    (0, _defineProperty3["default"])(this, "__init", true);
    this.options = _objectSpread({
      idField: "id",
      sourceIdField: "sourceId",
      targetIdField: "targetId",
      processNode: null,
      processEdge: null
    }, options);

    if (data) {
      this._initData(data);
    }

    this.__init = false;
  }

  (0, _createClass2["default"])(DGraphStore, [{
    key: "_initData",
    value: function _initData(data) {
      var _this = this;

      var _this$options = this.options,
          idField = _this$options.idField,
          sourceIdField = _this$options.sourceIdField,
          targetIdField = _this$options.targetIdField,
          processNode = _this$options.processNode,
          processEdge = _this$options.processEdge;
      var nodes = data.nodes || [];
      var edges = data.edges || [];

      if (nodes.length) {
        nodes.forEach(function (node) {
          node = processNode ? processNode(node) : node;

          _this.__NodeList.push(node);

          _this.__NodeMap[node[idField]] = node;
        });
      }

      if (edges.length) {
        edges.forEach(function (edge) {
          edge = processEdge ? processEdge(edge) : edge;
          var sourceId = edge[sourceIdField];
          var targetId = edge[targetIdField];
          _this.__NodeParentMap[sourceId] = _this.__NodeParentMap[sourceId] || [];
          _this.__NodeParentMap[targetId] = _this.__NodeParentMap[targetId] || [];
          _this.__NodeChildMap[sourceId] = _this.__NodeChildMap[sourceId] || [];
          _this.__NodeChildMap[targetId] = _this.__NodeChildMap[targetId] || [];

          _this.__EdgeList.push(edge);

          _this.__NodeParentMap[targetId].push(sourceId);

          _this.__NodeChildMap[sourceId].push(targetId);
        });
      }
    }
  }, {
    key: "getNodeList",
    value: function getNodeList() {
      return this.__NodeList;
    }
  }, {
    key: "getEdgeList",
    value: function getEdgeList() {
      return this.__EdgeList;
    }
  }, {
    key: "getNodeMap",
    value: function getNodeMap() {
      return this.__NodeMap;
    }
  }, {
    key: "getNodeParentMap",
    value: function getNodeParentMap() {
      return this.__NodeParentMap;
    }
  }, {
    key: "getNodeChildMap",
    value: function getNodeChildMap() {
      return this.__NodeChildMap;
    }
  }, {
    key: "hasNode",
    value: function hasNode(id) {
      return !!this.__NodeMap[id];
    }
  }, {
    key: "getNode",
    value: function getNode(id) {
      var NodeMap = this.__NodeMap;
      return NodeMap[id] || null;
    } //当前节点的出度是否为0

  }, {
    key: "isLeaf",
    value: function isLeaf(id) {
      var ret = this.getChildren(id);
      return !ret.length;
    } //当前节点的入度是否为0

  }, {
    key: "isRoot",
    value: function isRoot(id) {
      var ret = this.getParents(id);
      return !ret.length;
    } //获取指定顶点的入度数

  }, {
    key: "getInDegree",
    value: function getInDegree(id) {
      var ret = this.getParents(id);
      return ret.length;
    } //获取指定顶点的出度数

  }, {
    key: "getOutDegree",
    value: function getOutDegree(id) {
      var ret = this.getChildren(id);
      return ret.length;
    }
    /**
     * 获取指定顶点的子节点列表，如果有回路会排除自身节点
     *
     * @param {*} id
     * @returns
     * @memberof DGraphStore
     */

  }, {
    key: "getChildren",
    value: function getChildren(id) {
      var NodeChildMap = this.__NodeChildMap;
      var NodeMap = this.__NodeMap;
      var child = NodeChildMap[id] || [];
      return child.map(function (cid) {
        return cid === id ? null : NodeMap[cid];
      }).filter(function (v) {
        return v;
      });
    }
  }, {
    key: "getChildrenIds",
    value: function getChildrenIds(id) {
      var idField = this.options.idField;
      return this.getChildren(id).map(function (node) {
        return node[idField];
      });
    }
  }, {
    key: "getAllChildren",
    value: function getAllChildren(id) {
      var _this2 = this;

      var idField = this.options.idField;
      var NodeMap = this.__NodeMap;
      var hasWalk = (0, _create["default"])(null);
      var results = [];

      var walkNodes = function walkNodes(vid) {
        hasWalk[vid] = true;
        results.push(NodeMap[vid]);

        var child = _this2.getChildren(vid);

        child.forEach(function (node) {
          var cid = node[idField];
          if (hasWalk[cid]) return;
          walkNodes(cid);
        });
      };

      walkNodes(id);
      results.shift();
      return results;
    }
  }, {
    key: "getAllChildrenIds",
    value: function getAllChildrenIds(id) {
      var idField = this.options.idField;
      return this.getAllChildren(id).map(function (node) {
        return node[idField];
      });
    }
    /**
     * 获取指定顶点的父节点列表，如果有回路会排除自身节点
     *
     * @param {*} id
     * @returns
     * @memberof DGraphStore
     */

  }, {
    key: "getParents",
    value: function getParents(id) {
      var NodeParentMap = this.__NodeParentMap;
      var NodeMap = this.__NodeMap;
      var child = NodeParentMap[id] || [];
      return child.map(function (cid) {
        return cid === id ? null : NodeMap[cid];
      }).filter(function (v) {
        return v;
      });
    }
  }, {
    key: "getParentIds",
    value: function getParentIds(id) {
      var idField = this.options.idField;
      return this.getParents(id).map(function (node) {
        return node[idField];
      });
    }
  }, {
    key: "getAllParents",
    value: function getAllParents(id) {
      var _this3 = this;

      var idField = this.options.idField;
      var NodeMap = this.__NodeMap;
      var hasWalk = (0, _create["default"])(null);
      var results = [];

      var walkNodes = function walkNodes(vid) {
        hasWalk[vid] = true;
        results.push(NodeMap[vid]);

        var child = _this3.getParents(vid);

        child.forEach(function (node) {
          var cid = node[idField];
          if (hasWalk[cid]) return;
          walkNodes(cid);
        });
      };

      walkNodes(id);
      results.shift();
      return results;
    }
  }, {
    key: "getAllParentIds",
    value: function getAllParentIds(id) {
      var idField = this.options.idField;
      return this.getAllParents(id).map(function (node) {
        return node[idField];
      });
    }
    /**
     * 是否有向无环图
     * 使用拓扑排序进行检测
     * true:无环 false:有环
     * @returns {Boolean}
     * @memberof DGraphStore
     */

  }, {
    key: "isDAG",
    value: function isDAG() {
      var NodeParentMap = this.__NodeParentMap; //复制依赖关系数据

      var NodeDeps = (0, _create["default"])(null);
      (0, _keys["default"])(NodeParentMap).forEach(function (key) {
        NodeDeps[key] = NodeParentMap[key];
      });

      var getNoDepsNodes = function getNoDepsNodes() {
        var nodes = []; //找到没有依赖的节点并移除

        (0, _keys["default"])(NodeDeps).forEach(function (key) {
          var deps = NodeDeps[key];

          if (!deps.length) {
            nodes.push(key);
            delete NodeDeps[key];
          }
        }); //对剩下节点的依赖节点进行清理

        (0, _keys["default"])(NodeDeps).forEach(function (key) {
          var deps = NodeDeps[key];
          deps = deps.filter(function (key) {
            return key in NodeDeps;
          });
          NodeDeps[key] = deps;
        });
        return nodes;
      };

      var noDepsNodes;

      while (noDepsNodes = getNoDepsNodes()) {
        var keys = (0, _keys["default"])(NodeDeps);

        if (!noDepsNodes.length && keys.length) {
          return false;
        }

        if (!keys.length) break;
      }

      return true;
    }
    /**
     * 找出指定顶点的所有环路
     *
     * @param {String} vertexId 顶点ID
     * @returns {Array<Array<String>>}
     * @memberof DGraphStore
     */

  }, {
    key: "findCycle",
    value: function findCycle(id) {
      var _this4 = this;

      var idField = this.options.idField;
      var cyclePaths = []; //访问路径

      var stack = []; //访问路径标记，回路检测直接查找当前map而不查stack

      var stackMarked = (0, _create["default"])(null); //记录已遍历的节点
      // const visitMarked = Object.create(null);

      var dfs = function dfs(id) {
        // if (visitMarked[id]) return;
        //是否出现环路
        if (stackMarked[id]) {
          var idx = stack.indexOf(id);
          var path = stack.slice(idx); // path.push(id);

          cyclePaths.push(path);
          return;
        }

        stack.push(id);
        stackMarked[id] = true;

        var child = _this4.getChildren(id);

        child.forEach(function (node) {
          return dfs(node[idField]);
        });
        stack.pop();
        stackMarked[id] = false; // visitMarked[id] = true;
      };

      dfs(id); //去重

      var cyclePathsMap = (0, _create["default"])(null);
      return cyclePaths.filter(function (path) {
        var t = [].concat(path);
        t.sort();
        var p = t.join("/");

        if (cyclePathsMap[p]) {
          return false;
        }

        cyclePathsMap[p] = true;
        return true;
      });
    }
    /**
     * 判断指定顶点下是否出现环路
     *
     * @param {*} id
     * @returns {Boolean}
     * @memberof DGraphStore
     */

  }, {
    key: "hasCycle",
    value: function hasCycle(id) {
      var ret = this.findCycle(id);
      return !!ret.length;
    }
  }, {
    key: "addNode",
    value: function addNode(node) {
      this._initData({
        nodes: (0, _isArray["default"])(node) ? node : [node]
      });
    }
  }, {
    key: "addEdge",
    value: function addEdge(edge) {
      this._initData({
        edges: (0, _isArray["default"])(edge) ? edge : [edge]
      });
    }
  }, {
    key: "removeNode",
    value: function removeNode(id) {
      var _this$options2 = this.options,
          idField = _this$options2.idField,
          sourceIdField = _this$options2.sourceIdField,
          targetIdField = _this$options2.targetIdField;
      var NodeList = this.__NodeList;
      var EdgeList = this.__EdgeList;
      var NodeMap = this.__NodeMap;
      var NodeParentMap = this.__NodeParentMap;
      var NodeChildMap = this.__NodeChildMap; //delete node

      var idx = -1;

      for (var i = 0; i < NodeList.length; i++) {
        var node = NodeList[i];

        if (node[idField] === id) {
          idx = i;
          break;
        }
      }

      if (idx === -1) return;
      NodeList.splice(idx, 1);
      delete NodeMap[id]; //delete edge

      delete NodeParentMap[id];
      delete NodeChildMap[id];
      this.__EdgeList = EdgeList.filter(function (edge) {
        if (edge[sourceIdField] === id || edge[targetIdField] === id) {
          return false;
        }

        return true;
      });
      (0, _keys["default"])(NodeParentMap).forEach(function (key) {
        var deps = NodeParentMap[key];
        NodeParentMap[key] = deps.filter(function (pid) {
          return pid !== id;
        });
      });
      (0, _keys["default"])(NodeChildMap).forEach(function (key) {
        var child = NodeChildMap[key];
        NodeChildMap[key] = child.filter(function (cid) {
          return cid !== id;
        });
      });
    }
  }, {
    key: "removeEdge",
    value: function removeEdge(sourceId, targetId) {
      var _this$options3 = this.options,
          sourceIdField = _this$options3.sourceIdField,
          targetIdField = _this$options3.targetIdField;
      var EdgeList = this.__EdgeList;
      var NodeParentMap = this.__NodeParentMap;
      var NodeChildMap = this.__NodeChildMap;
      this.__EdgeList = EdgeList.filter(function (edge) {
        if (edge[sourceIdField] === sourceId && edge[targetIdField] === targetId) {
          return false;
        }

        return true;
      });
      var deps = NodeParentMap[targetId];
      var child = NodeChildMap[sourceId];
      NodeParentMap[targetId] = deps.filter(function (pid) {
        return pid !== sourceId;
      });
      NodeChildMap[sourceId] = child.filter(function (cid) {
        return cid !== targetId;
      });
    }
  }, {
    key: "hasEdge",
    value: function hasEdge(sourceId, targetId) {
      var _this$options4 = this.options,
          sourceIdField = _this$options4.sourceIdField,
          targetIdField = _this$options4.targetIdField;
      var EdgeList = this.__EdgeList;

      for (var i = 0; i < EdgeList.length; i++) {
        var edge = EdgeList[i];

        if (edge[sourceIdField] === sourceId && edge[targetIdField] === targetId) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "toData",
    value: function toData() {
      var NodeList = this.__NodeList;
      var EdgeList = this.__EdgeList;
      return {
        nodes: NodeList.map(function (node) {
          return _objectSpread({}, node);
        }),
        edges: EdgeList.map(function (edge) {
          return _objectSpread({}, edge);
        })
      };
    }
  }, {
    key: "removeAllNode",
    value: function removeAllNode() {
      this.__NodeList = [];
      this.__EdgeList = [];
      this.__NodeMap = (0, _create["default"])(null);
      this.__NodeParentMap = (0, _create["default"])(null);
      this.__NodeChildMap = (0, _create["default"])(null);
    }
  }, {
    key: "clone",
    value: function clone() {
      return (0, _cloneStore["default"])(this);
    }
  }]);
  return DGraphStore;
}();

exports["default"] = DGraphStore;