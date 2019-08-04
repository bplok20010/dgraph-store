import cloneStore from "./cloneStore";

export default class DGraphStore {
    options = {};
    // Array<Node>
    __NodeList = [];
    // Array<Edge>
    __EdgeList = [];
    // Object<String, String>
    __NodeMap = Object.create(null);
    // Object<String, String>
    __NodeParentMap = Object.create(null);
    // Object<String, String>
    __NodeChildMap = Object.create(null);
    __init = true;
    // _cache = new Cache();
    /**
     *Creates an instance of DGraphStore.
     * @param {Object} data
     * @param {Array} data.nodes
     * @param {Array} data.edges
     * @param {Object} options
     * @memberof DGraphStore
     */
    constructor(data, options = {}) {
        this.options = {
            idField: "id",
            sourceIdField: "sourceId",
            targetIdField: "targetId",
            processNode: null,
            processEdge: null,
            ...options
        };

        if (data) {
            this._initData(data);
        }

        this.__init = false;
    }

    _initData(data) {
        const {
            idField,
            sourceIdField,
            targetIdField,
            processNode,
            processEdge
        } = this.options;
        const nodes = data.nodes || [];
        const edges = data.edges || [];

        if (nodes.length) {
            nodes.forEach(node => {
                node = processNode ? processNode(node) : node;
                this.__NodeList.push(node);
                this.__NodeMap[node[idField]] = node;
            });
        }

        if (edges.length) {
            edges.forEach(edge => {
                edge = processEdge ? processEdge(edge) : edge;

                const sourceId = edge[sourceIdField];
                const targetId = edge[targetIdField];

                this.__NodeParentMap[sourceId] =
                    this.__NodeParentMap[sourceId] || [];
                this.__NodeParentMap[targetId] =
                    this.__NodeParentMap[targetId] || [];
                this.__NodeChildMap[sourceId] =
                    this.__NodeChildMap[sourceId] || [];
                this.__NodeChildMap[targetId] =
                    this.__NodeChildMap[targetId] || [];

                this.__EdgeList.push(edge);
                this.__NodeParentMap[targetId].push(sourceId);
                this.__NodeChildMap[sourceId].push(targetId);
            });
        }
    }

    getNodeList() {
        return this.__NodeList;
    }

    getEdgeList() {
        return this.__EdgeList;
    }

    getNodeMap() {
        return this.__NodeMap;
    }

    getNodeParentMap() {
        return this.__NodeParentMap;
    }

    getNodeChildMap() {
        return this.__NodeChildMap;
    }

    hasNode(id) {
        return !!this.__NodeMap[id];
    }

    getNode(id) {
        const NodeMap = this.__NodeMap;

        return NodeMap[id] || null;
    }

    //当前节点的出度是否为0
    isLeaf(id) {
        const ret = this.getChildren(id);
        return !ret.length;
    }
    //当前节点的入度是否为0
    isRoot(id) {
        const ret = this.getParents(id);
        return !ret.length;
    }

    //获取指定顶点的入度数
    getInDegree(id) {
        const ret = this.getParents(id);
        return ret.length;
    }

    //获取指定顶点的出度数
    getOutDegree(id) {
        const ret = this.getChildren(id);
        return ret.length;
    }

    /**
     * 获取指定顶点的子节点列表，如果有回路会排除自身节点
     *
     * @param {*} id
     * @returns
     * @memberof DGraphStore
     */
    getChildren(id) {
        const NodeChildMap = this.__NodeChildMap;
        const NodeMap = this.__NodeMap;
        const child = NodeChildMap[id] || [];

        return child
            .map(cid => (cid === id ? null : NodeMap[cid]))
            .filter(v => v);
    }

    getChildrenIds(id) {
        const { idField } = this.options;
        return this.getChildren(id).map(node => node[idField]);
    }

    getAllChildren(id) {
        const { idField } = this.options;
        const NodeMap = this.__NodeMap;
        const hasWalk = Object.create(null);
        const results = [];
        const walkNodes = vid => {
            hasWalk[vid] = true;
            results.push(NodeMap[vid]);
            const child = this.getChildren(vid);
            child.forEach(node => {
                const cid = node[idField];
                if (hasWalk[cid]) return;
                walkNodes(cid);
            });
        };

        walkNodes(id);

        results.shift();

        return results;
    }

    getAllChildrenIds(id) {
        const { idField } = this.options;
        return this.getAllChildren(id).map(node => node[idField]);
    }
    /**
     * 获取指定顶点的父节点列表，如果有回路会排除自身节点
     *
     * @param {*} id
     * @returns
     * @memberof DGraphStore
     */
    getParents(id) {
        const NodeParentMap = this.__NodeParentMap;
        const NodeMap = this.__NodeMap;
        const child = NodeParentMap[id] || [];

        return child
            .map(cid => (cid === id ? null : NodeMap[cid]))
            .filter(v => v);
    }

    getParentIds(id) {
        const { idField } = this.options;
        return this.getParents(id).map(node => node[idField]);
    }

    getAllParents(id) {
        const { idField } = this.options;
        const NodeMap = this.__NodeMap;
        const hasWalk = Object.create(null);
        const results = [];
        const walkNodes = vid => {
            hasWalk[vid] = true;
            results.push(NodeMap[vid]);
            const child = this.getParents(vid);
            child.forEach(node => {
                const cid = node[idField];
                if (hasWalk[cid]) return;
                walkNodes(cid);
            });
        };

        walkNodes(id);

        results.shift();

        return results;
    }

    getAllParentIds(id) {
        const { idField } = this.options;
        return this.getAllParents(id).map(node => node[idField]);
    }

    /**
     * 是否有向无环图
     * 使用拓扑排序进行检测
     * true:无环 false:有环
     * @returns {Boolean}
     * @memberof DGraphStore
     */
    isDAG() {
        const NodeParentMap = this.__NodeParentMap;
        //复制依赖关系数据
        const NodeDeps = Object.create(null);
        Object.keys(NodeParentMap).forEach(key => {
            NodeDeps[key] = NodeParentMap[key];
        });

        const getNoDepsNodes = () => {
            const nodes = [];
            //找到没有依赖的节点并移除
            Object.keys(NodeDeps).forEach(key => {
                const deps = NodeDeps[key];
                if (!deps.length) {
                    nodes.push(key);
                    delete NodeDeps[key];
                }
            });
            //对剩下节点的依赖节点进行清理
            Object.keys(NodeDeps).forEach(key => {
                let deps = NodeDeps[key];
                deps = deps.filter(key => key in NodeDeps);
                NodeDeps[key] = deps;
            });

            return nodes;
        };

        let noDepsNodes;

        while ((noDepsNodes = getNoDepsNodes())) {
            const keys = Object.keys(NodeDeps);
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
    findCycle(id) {
        const { idField } = this.options;
        const cyclePaths = [];
        //访问路径
        const stack = [];
        //访问路径标记，回路检测直接查找当前map而不查stack
        const stackMarked = Object.create(null);
        //记录已遍历的节点
        // const visitMarked = Object.create(null);

        const dfs = id => {
            // if (visitMarked[id]) return;

            //是否出现环路
            if (stackMarked[id]) {
                const idx = stack.indexOf(id);
                const path = stack.slice(idx);
                // path.push(id);
                cyclePaths.push(path);
                return;
            }
            stack.push(id);
            stackMarked[id] = true;

            const child = this.getChildren(id);
            child.forEach(node => dfs(node[idField]));

            stack.pop();
            stackMarked[id] = false;
            // visitMarked[id] = true;
        };

        dfs(id);

        //去重
        const cyclePathsMap = Object.create(null);
        return cyclePaths.filter(path => {
            let t = [].concat(path);
            t.sort();

            const p = t.join("/");

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
    hasCycle(id) {
        const ret = this.findCycle(id);
        return !!ret.length;
    }

    addNode(node) {
        this._initData({
            nodes: Array.isArray(node) ? node : [node]
        });
    }

    addEdge(edge) {
        this._initData({
            edges: Array.isArray(edge) ? edge : [edge]
        });
    }

    removeNode(id) {
        const { idField, sourceIdField, targetIdField } = this.options;
        const NodeList = this.__NodeList;
        const EdgeList = this.__EdgeList;
        const NodeMap = this.__NodeMap;
        const NodeParentMap = this.__NodeParentMap;
        const NodeChildMap = this.__NodeChildMap;
        //delete node
        let idx = -1;
        for (let i = 0; i < NodeList.length; i++) {
            const node = NodeList[i];
            if (node[idField] === id) {
                idx = i;
                break;
            }
        }
        if (idx === -1) return;

        NodeList.splice(idx, 1);
        delete NodeMap[id];

        //delete edge
        delete NodeParentMap[id];
        delete NodeChildMap[id];
        this.__EdgeList = EdgeList.filter(edge => {
            if (edge[sourceIdField] === id || edge[targetIdField] === id) {
                return false;
            }
            return true;
        });

        Object.keys(NodeParentMap).forEach(key => {
            const deps = NodeParentMap[key];
            NodeParentMap[key] = deps.filter(pid => pid !== id);
        });
        Object.keys(NodeChildMap).forEach(key => {
            const child = NodeChildMap[key];
            NodeChildMap[key] = child.filter(cid => cid !== id);
        });
    }

    removeEdge(sourceId, targetId) {
        const { sourceIdField, targetIdField } = this.options;
        const EdgeList = this.__EdgeList;
        const NodeParentMap = this.__NodeParentMap;
        const NodeChildMap = this.__NodeChildMap;

        this.__EdgeList = EdgeList.filter(edge => {
            if (
                edge[sourceIdField] === sourceId &&
                edge[targetIdField] === targetId
            ) {
                return false;
            }
            return true;
        });

        const deps = NodeParentMap[targetId];
        const child = NodeChildMap[sourceId];

        NodeParentMap[targetId] = deps.filter(pid => pid !== sourceId);
        NodeChildMap[sourceId] = child.filter(cid => cid !== targetId);
    }

    hasEdge(sourceId, targetId) {
        const { sourceIdField, targetIdField } = this.options;
        const EdgeList = this.__EdgeList;

        for (let i = 0; i < EdgeList.length; i++) {
            const edge = EdgeList[i];
            if (
                edge[sourceIdField] === sourceId &&
                edge[targetIdField] === targetId
            ) {
                return true;
            }
        }

        return false;
    }

    toData() {
        const NodeList = this.__NodeList;
        const EdgeList = this.__EdgeList;
        return {
            nodes: NodeList.map(node => ({ ...node })),
            edges: EdgeList.map(edge => ({ ...edge }))
        };
    }

    removeAllNode() {
        this.__NodeList = [];
        this.__EdgeList = [];
        this.__NodeMap = Object.create(null);
        this.__NodeParentMap = Object.create(null);
        this.__NodeChildMap = Object.create(null);
    }

    clone() {
        return cloneStore(this);
    }
}
