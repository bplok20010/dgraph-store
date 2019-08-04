export default function cloneStore(store) {
    const newStore = new store.constructor(store.toData());

    newStore.options = store.options;

    return newStore;
}
