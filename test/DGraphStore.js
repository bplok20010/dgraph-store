const assert = require("assert");
const { default: DGraphStore } = require("../lib/index");

const dataset = {
    nodes: [
        {
            id: "0"
        },
        {
            id: "1"
        },
        {
            id: "2"
        },
        {
            id: "3"
        },
        {
            id: "4"
        },
        {
            id: "5"
        },
        {
            id: "6"
        },
        {
            id: "7"
        },
        {
            id: "8"
        },
        {
            id: "9"
        },
        {
            id: "10"
        },
        {
            id: "11"
        },
        {
            id: "12"
        }
    ],
    edges: [
        [0, 1],
        [0, 5],
        [0, 6],
        [2, 0],
        [2, 3],
        [3, 5],
        [5, 4],
        [6, 4],
        [6, 9],
        [7, 6],
        [8, 7],
        [9, 10],
        [9, 11],
        [11, 12],
        [12, 12]
    ].map(edge => ({
        sourceId: edge[0] + "",
        targetId: edge[1] + ""
    }))
};

const graph = new DGraphStore(dataset);

// test getChildren
assert.deepEqual(
    graph.getChildren("12").map(r => r.id),
    ["12"],
    'graph.getChildren("12")'
);
assert.deepEqual(
    graph.getParents("12").map(r => r.id),
    ["11", "12"],
    'graph.getParents("12")'
);

// test getChildren
assert.deepEqual(
    graph.getChildren("6").map(r => r.id),
    ["4", "9"],
    'graph.getChildren("6")'
);

let ret1 = graph.getAllChildren("6");
assert.deepEqual(
    ret1.map(r => r.id),
    ["4", "9", "10", "11", "12"],
    'graph.getAllChildren("6")'
);

ret1 = graph.getAllChildren("0");
assert.deepEqual(
    ret1.map(r => r.id),
    ["1", "5", "4", "6", "9", "10", "11", "12"],
    'graph1.getAllChildren("0")'
);

// test getParents
assert.deepEqual(
    graph.getParents("4").map(r => r.id),
    ["5", "6"],
    'graph1.getParents("4")'
);

assert.deepEqual(
    graph.getDependentNodes("4").map(r => r.id),
    ["5", "6"],
    'graph1.getDependentNodes("4")'
);

assert.deepEqual(
    graph.getAllParents("4").map(r => r.id),
    ["5", "0", "2", "3", "6", "7", "8"],
    'graph1.getAllParents("4")'
);

assert.deepEqual(
    graph.getAllDependentNodes("4").map(r => r.id),
    ["5", "0", "2", "3", "6", "7", "8"],
    'graph1.getAllDependentNodes("4")'
);

assert.deepEqual(
    graph.getAllParents("9").map(r => r.id),
    ["6", "0", "2", "7", "8"],
    'graph1.getAllParents("9")'
);
// 检测闭环
assert.ok(!graph.isDAG(), "!graph.isDAG()");

const graph1 = new DGraphStore({
    nodes: dataset.nodes,
    edges: [
        ...dataset.edges,
        {
            sourceId: "9",
            targetId: "2"
        }
    ]
});

// 检测闭环
assert.ok(!graph1.isDAG(), "!graph1.isDAG()");
assert.deepEqual(
    graph1.getChildren("0").map(r => r.id),
    ["1", "5", "6"],
    'graph1.getChildren("0")'
);
assert.deepEqual(
    graph1.getAllChildren("0").map(r => r.id),
    ["1", "5", "4", "6", "9", "10", "11", "12", "2", "3"],
    'graph1.getAllChildren("0")'
);
assert.deepEqual(
    graph1.getAllParents("0").map(r => r.id),
    ["2", "9", "6", "7", "8"],
    'graph1.getAllParents("0")'
);
