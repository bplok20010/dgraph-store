import cloneStore from "./cloneStore";
import Cache from "./Cache";

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
    //缓存计算结果
    _cache = new Cache();
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
            processNode: null,
            processEdge: null,
            cache: true,
            ...options
        };

        if (data) {
            this._initData(data);
        }
    }

    _initData(data) {
        const { processNode, processEdge } = this.options;
        const nodes = data.nodes || [];
        const edges = data.edges || [];

        if (nodes.length) {
            nodes.forEach(node => {
                node = processNode ? processNode(node) : node;
                this.__NodeList.push(node);
                this.__NodeMap[node.id] = node;
            });
        }

        if (edges.length) {
            edges.forEach(edge => {
                edge = processEdge ? processEdge(edge) : edge;

                const sourceId = edge.sourceId;
                const targetId = edge.targetId;

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

        return NodeMap[id];
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

    clearCache() {
        this._cache.clear();
    }

    /**
     * 获取指定顶点的子节点列表
     *
     * @param {*} id
     * @returns
     * @memberof DGraphStore
     */
    getChildren(id) {
        const NodeMap = this.__NodeMap;

        return this.getChildrenIds(id).map(id => NodeMap[id]);
    }

    getChildrenIds(id) {
        const NodeChildMap = this.__NodeChildMap;
        const child = NodeChildMap[id] || [];

        return [].concat(child);
    }

    getAllChildren(id) {
        const NodeMap = this.__NodeMap;

        return this.getAllChildrenIds(id).map(id => NodeMap[id]);
    }

    getAllChildrenIds(id) {
        const hasWalk = Object.create(null);
        const results = [];
        const walkNodes = vid => {
            results.push(vid);
            const child = this.getChildrenIds(vid);
            child.forEach(cid => {
                if (hasWalk[cid]) return;
                hasWalk[cid] = true;
                walkNodes(cid);
            });
        };

        walkNodes(id);

        results.shift();

        return results;
    }
    /**
     * 获取指定顶点的父节点列表
     *
     * @param {*} id
     * @returns
     * @memberof DGraphStore
     */
    getParents(id) {
        const NodeMap = this.__NodeMap;
        const child = this.getParentIds(id);

        return child.map(cid => NodeMap[cid]);
    }

    getParentIds(id) {
        const NodeParentMap = this.__NodeParentMap;
        const child = NodeParentMap[id] || [];

        return [].concat(child);
    }

    getAllParents(id) {
        const NodeMap = this.__NodeMap;
        return this.getAllParentIds(id).map(id => NodeMap[id]);
    }

    getAllParentIds(id) {
        const hasWalk = Object.create(null);
        const results = [];
        const walkNodes = vid => {
            results.push(vid);
            const child = this.getParentIds(vid);
            child.forEach(cid => {
                if (hasWalk[cid]) return;
                hasWalk[cid] = true;
                walkNodes(cid);
            });
        };

        walkNodes(id);

        results.shift();

        return results;
    }

    getDependentNodes(id) {
        return this.getParents(id);
    }

    getDependentIds(id) {
        return this.getParentIds(id);
    }

    getAllDependentNodes(id) {
        return this.getAllParents(id);
    }

    getAllDependentIds(id) {
        return this.getAllParentIds(id);
    }

    /**
     * 是否有向无环图
     * 使用拓扑排序进行检测
     * true:无环 false:有环
     * @returns {Boolean}
     * @memberof DGraphStore
     */
    isDAG() {
        const { cache } = this.options;

        if (cache && this._cache.has("isDAG")) {
            return this._cache.get("isDAG");
        }

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
        let result = true;

        while ((noDepsNodes = getNoDepsNodes())) {
            const keys = Object.keys(NodeDeps);
            if (!noDepsNodes.length && keys.length) {
                result = false;
                break;
            }

            if (!keys.length) break;
        }

        if (cache) {
            this._cache.set("isDAG", result);
        }

        return result;
    }

    _getFindCycleKey(id) {
        return `findCycle_${id}`;
    }

    /**
     * 找出指定顶点的所有环路
     *
     * @param {String} vertexId 顶点ID
     * @returns {Array<Array<String>>}
     * @memberof DGraphStore
     */
    _findCycle(id) {
        const { cache } = this.options;
        const C_KEY = this._getFindCycleKey(id);
        if (cache && this._cache.has(C_KEY)) {
            return this._cache.get(C_KEY);
        }

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
                //关于 A->B B->A
                //如果不执行下面这行,则只会记录一条闭环: A,B
                //否则两条: A,B,A  B,A,B
                path.push(id);
                cyclePaths.push(path);
                return;
            }
            stack.push(id);
            stackMarked[id] = true;

            const child = this.getChildren(id);
            child.forEach(node => dfs(node.id));

            stack.pop();
            stackMarked[id] = false;
            // visitMarked[id] = true;
        };

        dfs(id);

        if (cache) {
            this._cache.set(C_KEY, cyclePaths);
        }

        return cyclePaths;
    }

    //闭环去重
    _uniqCyclePath(cyclePaths) {
        const cyclePathsMap = Object.create(null);
        const sep = "/";

        return cyclePaths.filter(path => {
            let t = [].concat(path);
            t.sort();

            const p = t.join(sep);

            if (cyclePathsMap[p]) {
                return false;
            }

            cyclePathsMap[p] = true;

            return true;
        });
    }

    findCycle(id) {
        const ids = Array.isArray(id) ? id : [id];
        let cyclePaths = [];

        for (let i = 0; i < ids.length; i++) {
            cyclePaths = cyclePaths.concat(this._findCycle(ids[i]));
        }

        return this._uniqCyclePath(cyclePaths);
    }

    findAllCycle() {
        const NodeList = this.__NodeList;

        return this.findCycle(NodeList.map(node => node.id));
    }
    /**
     * 找出开始到结束节点之间的所有可通过路径
     *
     * @param {String} from 开始节点
     * @param {String} to 结束节点
     * @returns {Array<Array<String>>} 返回节点ID列表
     * @memberof DGraphStore
     */
    findAllPath(from, to) {
        const { cache } = this.options;
        const C_KEY = `findAllPath(${from}, ${to})`;

        if (from == null || to == null) {
            throw "Parameter error!";
        }

        if (!this.hasNode(from) || !this.hasNode(to)) {
            return [];
        }

        if (cache && this._cache.has(C_KEY)) {
            return this._cache.get(C_KEY);
        }

        const paths = [];
        //访问路径
        const stack = [];
        //访问路径标记，回路检测直接查找当前map而不查stack
        const stackMarked = Object.create(null);

        const dfs = id => {
            // 检测自身依赖 case: A -> A
            if (stack.length && id === to) {
                paths.push([].concat(stack, to));
                return;
            }

            //是否出现环路
            if (stackMarked[id]) {
                return;
            }

            stack.push(id);
            stackMarked[id] = true;

            const child = this.getChildren(id);
            child.forEach(node => dfs(node.id));

            stack.pop();
            stackMarked[id] = false;
        };

        dfs(from);

        if (cache) {
            this._cache.set(C_KEY, paths);
        }

        return paths;
    }

    /**
     * 判断指定顶点下是否出现环路
     *
     * @param {*} id
     * @returns {Boolean}
     * @memberof DGraphStore
     */
    hasCycle(id) {
        const ret = this._findCycle(id);
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

        this.clearCache();
    }

    removeNode(id) {
        const NodeList = this.__NodeList;
        const EdgeList = this.__EdgeList;
        const NodeMap = this.__NodeMap;
        const NodeParentMap = this.__NodeParentMap;
        const NodeChildMap = this.__NodeChildMap;
        //delete node
        let idx = -1;
        for (let i = 0; i < NodeList.length; i++) {
            const node = NodeList[i];
            if (node.id === id) {
                idx = i;
                break;
            }
        }
        if (idx === -1) return;

        this.clearCache();

        NodeList.splice(idx, 1);
        delete NodeMap[id];

        //delete edge
        delete NodeParentMap[id];
        delete NodeChildMap[id];
        this.__EdgeList = EdgeList.filter(edge => {
            if (edge.sourceId === id || edge.targetId === id) {
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
        const EdgeList = this.__EdgeList;
        const NodeParentMap = this.__NodeParentMap;
        const NodeChildMap = this.__NodeChildMap;

        this.clearCache();

        this.__EdgeList = EdgeList.filter(edge => {
            if (edge.sourceId === sourceId && edge.targetId === targetId) {
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
        const EdgeList = this.__EdgeList;

        for (let i = 0; i < EdgeList.length; i++) {
            const edge = EdgeList[i];
            if (edge.sourceId === sourceId && edge.targetId === targetId) {
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
        this.clearCache();
    }

    clone() {
        return cloneStore(this);
    }
}
