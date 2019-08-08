const { default: DGraphStore } = require("../lib/index");
const assert = require("assert");
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
        [2, 0],
        [2, 3],
        [3, 2],
        [3, 5],
        [4, 2],
        [4, 3],
        [5, 4],
        [6, 0],
        [6, 4],
        [6, 9],
        [7, 6],
        [7, 8],
        [8, 7],
        [8, 9],
        [9, 10],
        [9, 11],
        [10, 12],
        [11, 12],
        [12, 9]
    ].map(edge => ({
        sourceId: edge[0] + "",
        targetId: edge[1] + ""
    }))
};

let graph = new DGraphStore();

dataset.nodes.forEach(node => {
    graph.addNode(node);
});
dataset.edges.forEach(edge => {
    graph.addEdge(edge);
});

assert.ok(!graph.hasNode("13"), '!graph.hasNode("13")');

assert.ok(graph.getNode("13") == undefined, 'graph.getNode("13")');

graph.addNode({
    id: "13"
});
graph.addNode({
    id: "14"
});

assert.ok(graph.getNode("13").id === "13", 'graph.getNode("13").id');

assert.ok(graph.hasNode("13"), 'graph.hasNode("13")');

graph.addEdge({
    sourceId: "4",
    targetId: "13"
});

assert.ok(!graph.hasEdge("13", "14"), 'graph.hasEdge("13", "14")');

graph.addEdge({
    sourceId: "13",
    targetId: "14"
});

assert.ok(graph.hasEdge("13", "14"), 'graph.hasEdge("13", "14")');

graph.removeNode("13");
graph.removeNode("14");

//clone
graph = graph.clone();

assert.deepEqual(
    graph.findCycle("0"),
    [
        ["0", "5", "4", "2", "0"],
        ["2", "3", "2"],
        ["5", "4", "2", "3", "5"],
        ["0", "5", "4", "3", "2", "0"],
        ["3", "2", "3"],
        ["5", "4", "3", "5"]
    ],
    'graph.findCycle("0") m'
);

assert.deepEqual(
    graph.findCycle("3"),
    [
        ["2", "0", "5", "4", "2"],
        ["3", "2", "0", "5", "4", "3"],
        ["3", "2", "3"],
        ["5", "4", "2", "0", "5"],
        ["3", "5", "4", "2", "3"],
        ["3", "5", "4", "3"]
    ],
    'graph.findCycle("3") m'
);

assert.deepEqual(
    graph.findCycle("7"),
    [
        ["0", "5", "4", "2", "0"],
        ["2", "3", "2"],
        ["5", "4", "2", "3", "5"],
        ["0", "5", "4", "3", "2", "0"],
        ["3", "2", "3"],
        ["5", "4", "3", "5"],
        ["4", "2", "0", "5", "4"],
        ["4", "2", "3", "5", "4"],
        ["4", "3", "2", "0", "5", "4"],
        ["4", "3", "5", "4"],
        ["9", "10", "12", "9"],
        ["9", "11", "12", "9"],
        ["7", "8", "7"]
    ],
    'graph.findCycle("7") m'
);

assert.deepEqual(
    graph.findCycle("7"),
    [
        ["0", "5", "4", "2", "0"],
        ["2", "3", "2"],
        ["5", "4", "2", "3", "5"],
        ["0", "5", "4", "3", "2", "0"],
        ["3", "2", "3"],
        ["5", "4", "3", "5"],
        ["4", "2", "0", "5", "4"],
        ["4", "2", "3", "5", "4"],
        ["4", "3", "2", "0", "5", "4"],
        ["4", "3", "5", "4"],
        ["9", "10", "12", "9"],
        ["9", "11", "12", "9"],
        ["7", "8", "7"]
    ],
    'graph.findCycle("7") test tache m'
);

assert.deepEqual(
    graph.getChildren("0").map(r => r.id),
    ["1", "5"],
    'graph.getChildren("0")'
);

assert.deepEqual(
    graph.getAllChildren("0").map(r => r.id),
    ["1", "5", "4", "2", "0", "3"],
    'graph.getAllChildren("0")'
);

assert.deepEqual(
    graph.getAllParents("0").map(r => r.id),
    ["2", "3", "4", "5", "0", "6", "7", "8"],
    'graph.getAllParents("0")'
);
