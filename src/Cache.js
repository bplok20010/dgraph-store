export default class Cache {
    _caches = Object.create(null);

    set(key, value) {
        this._caches[key] = value;
    }
    get(key) {
        return this._caches[key];
    }
    has(key) {
        return key in this._caches;
    }
    delete(key) {
        delete this._caches[key];
    }
    clear() {
        this._caches = Object.create(null);
    }
}
