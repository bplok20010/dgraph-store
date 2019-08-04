
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cloneStore = _interopRequireDefault(require("./cloneStore"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
    (0, _defineProperty2["default"])(this, "options", {});
    (0, _defineProperty2["default"])(this, "__NodeList", []);
    (0, _defineProperty2["default"])(this, "__EdgeList", []);
    (0, _defineProperty2["default"])(this, "__NodeMap", Object.create(null));
    (0, _defineProperty2["default"])(this, "__NodeParentMap", Object.create(null));
    (0, _defineProperty2["default"])(this, "__NodeChildMap", Object.create(null));
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
      var hasWalk = Object.create(null);
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
      var hasWalk = Object.create(null);
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

      var NodeDeps = Object.create(null);
      Object.keys(NodeParentMap).forEach(function (key) {
        NodeDeps[key] = NodeParentMap[key];
      });

      var getNoDepsNodes = function getNoDepsNodes() {
        var nodes = []; //找到没有依赖的节点并移除

        Object.keys(NodeDeps).forEach(function (key) {
          var deps = NodeDeps[key];

          if (!deps.length) {
            nodes.push(key);
            delete NodeDeps[key];
          }
        }); //对剩下节点的依赖节点进行清理

        Object.keys(NodeDeps).forEach(function (key) {
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
        var keys = Object.keys(NodeDeps);

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
    key: "_findCycle",
    value: function _findCycle(id) {
      var _this4 = this;

      var idField = this.options.idField;
      var cyclePaths = []; //访问路径

      var stack = []; //访问路径标记，回路检测直接查找当前map而不查stack

      var stackMarked = Object.create(null); //记录已遍历的节点
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

      dfs(id);
      return cyclePaths;
    } //闭环去重

  }, {
    key: "_uniqCyclePath",
    value: function _uniqCyclePath(cyclePaths) {
      var cyclePathsMap = Object.create(null);
      var sep = "/";
      return cyclePaths.filter(function (path) {
        var t = [].concat(path);
        t.sort();
        var p = t.join(sep);

        if (cyclePathsMap[p]) {
          return false;
        }

        cyclePathsMap[p] = true;
        return true;
      });
    }
  }, {
    key: "findCycle",
    value: function findCycle(id) {
      var ids = Array.isArray(id) ? id : [id];
      var cyclePaths = [];

      for (var i = 0; i < ids.length; i++) {
        cyclePaths = cyclePaths.concat(this._findCycle(ids[i]));
      }

      return this._uniqCyclePath(cyclePaths);
    }
  }, {
    key: "findAllCycle",
    value: function findAllCycle() {
      var idField = this.options.idField;
      var NodeList = this.__NodeList;
      return this.findCycle(NodeList.map(function (node) {
        return node[idField];
      }));
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
      var ret = this._findCycle(id);

      return !!ret.length;
    }
  }, {
    key: "addNode",
    value: function addNode(node) {
      this._initData({
        nodes: Array.isArray(node) ? node : [node]
      });
    }
  }, {
    key: "addEdge",
    value: function addEdge(edge) {
      this._initData({
        edges: Array.isArray(edge) ? edge : [edge]
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
      Object.keys(NodeParentMap).forEach(function (key) {
        var deps = NodeParentMap[key];
        NodeParentMap[key] = deps.filter(function (pid) {
          return pid !== id;
        });
      });
      Object.keys(NodeChildMap).forEach(function (key) {
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
      this.__NodeMap = Object.create(null);
      this.__NodeParentMap = Object.create(null);
      this.__NodeChildMap = Object.create(null);
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