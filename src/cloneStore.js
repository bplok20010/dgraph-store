export default function cloneStore(store) {
    const newStore = new store.constructor(store.toData(), store.options);

    return newStore;
}
