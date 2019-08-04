# dgraph-store

构建有向图数据模型

## install & import & useage

`npm install --save dgraph-store`

`import DGraphStore, { createStore, cloneStore } from 'dgraph-store'`

```
import DGraphStore, { createStore, cloneStore } from 'dgraph-store'
const data = {
    nodes: [{
        id: 'A'
    },{
        id: 'B'
    }],
    edges: [
        {sourceId: 'A', 'targetId': 'B'}
    ]
}

const store = new DGraphStore(data);

```

## DGraphStore

## options

```
{
     idField: 'id',
     sourceIdField: 'sourceId',
     targetIdField: 'targetId',
     processNode: node => node,
     processEdge: node => node,
}
```

## API

### 常用 API

`constructor(data[, options])` 构造函数

`isRoot(id)` 判断指定节点是否无依赖节点

`isLeaf(id)` 判断指定节点是否无子节点

`getNodeList()` 获取所有节点 `Array<Node>`

`getNodeMap()` 获取节点 Map<key,Node>对象

`hasNode(id)` 当前节点是否存在

`getNode(id)` 获取指定节点

`getChildren(id)` 获取节点下的子节点 返回：`Array<Node>`

`getChildrenIds(id)` 作用参考`getChildren` 返回：`Array<String>`

`getAllChildren(id)` 获取节点下的所有子节点 返回：`Array<Node>`

> 深度遍历获取所有“子节点”

`getAllChildrenIds(id)` 作用参考`getAllChildren` 返回：`Array<String>`

`getParents(id)` 获取指定节点的所依赖的节点（父节点） 返回：`Array<Node>`

`getParentIds(id)` 作用参考`getParents` 返回：`Array<String>`

`getAllParents(id)` 获取指定节点的所有依赖的节点（父节点） 返回：`Array<Node>`

> 深度遍历获取所有“父节点”

`getAllParentIds(id)` 作用参考`getAllParents` 返回：`Array<String>`

`getInDegree(id)` 获取指定节点的入度数（父节点数）返回：`Number`

`getOutDegree(id)` 获取指定节点的出度数（子节点数）返回：`Number`

`isDAG()` 判断当前图是否`有向无环图` 返回：`Boolean`

> true: 无环图 false：有环图

`findCycle(String | Array)` 获取指定节点的所有环路 返回：`Array<String>`

`findAllCycle()` 获取当前模型下所有环路列表

`hasCycle(id)` 判断指定起始顶点下是否存在闭环

`hasEdge(sourceId, targetId)` 判断指定两节点是否有连线

### 模型管理 API

`addNode(node: Array<Node> | Node)` 给指定 pid 节点添加子节点

`addEdge(edge: Array<Edge> | Edge)`

`removeNode(id)`

`removeEdge(sourceId, targetId)`

`removeAllNode()`

### 模型数据转换 API

`toData()` 返回模型数据

```
{
    nodes: [...],
    edges: [...]
}
```

### 其他

`clone()` 返回一个新的模型实例

## createStore(data, options)

作用同`new DGraphStore(...)`

## cloneStore(store)

复制数据模型并返回新实例
