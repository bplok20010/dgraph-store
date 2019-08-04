import DGraphStore from "./DGraphStore";

export default function createStore(data, options) {
    return new DGraphStore(data, options);
}
