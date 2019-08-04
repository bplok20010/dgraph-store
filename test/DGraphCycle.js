const DGraphStore = require("../index");
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

const graph = new DGraphStore(dataset);

assert.deepEqual(
    graph.findCycle("0"),
    [
        ["0", "5", "4", "2"],
        ["2", "3"],
        ["5", "4", "2", "3"],
        ["0", "5", "4", "3", "2"],
        ["5", "4", "3"]
    ],
    'graph.findCycle("0")'
);

assert.deepEqual(
    graph.findCycle("3"),
    [
        ["2", "0", "5", "4"],
        ["3", "2", "0", "5", "4"],
        ["3", "2"],
        ["3", "5", "4", "2"],
        ["3", "5", "4"]
    ],
    'graph.findCycle("3")'
);

assert.deepEqual(
    graph.findCycle("7"),
    [
        ["0", "5", "4", "2"],
        ["2", "3"],
        ["5", "4", "2", "3"],
        ["0", "5", "4", "3", "2"],
        ["5", "4", "3"],
        ["9", "10", "12"],
        ["9", "11", "12"],
        ["7", "8"]
    ],
    'graph.findCycle("7")'
);

assert.deepEqual(
    graph.getChildren("0").map(r => r.id),
    ["1", "5"],
    'graph.getChildren("0")'
);
assert.deepEqual(
    graph.getAllChildren("0").map(r => r.id),
    ["1", "5", "4", "2", "3"],
    'graph.getAllChildren("0")'
);

assert.deepEqual(
    graph.getAllParents("0").map(r => r.id),
    ["2", "3", "4", "5", "6", "7", "8"],
    'graph.getAllParents("0")'
);
