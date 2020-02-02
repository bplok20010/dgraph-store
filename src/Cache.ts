export default class Cache {
	_caches: { [x: string]: any } = Object.create(null);

	set(key: string, value: any) {
		this._caches[key] = value;
	}
	get(key: string) {
		return this._caches[key];
	}
	has(key: string) {
		return key in this._caches;
	}
	delete(key: string) {
		delete this._caches[key];
	}
	clear() {
		this._caches = Object.create(null);
	}
}
