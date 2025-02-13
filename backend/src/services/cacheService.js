import NodeCache from 'node-cache';
import crypto from 'crypto';

class CacheService {
    constructor() {
        this.cache = new NodeCache({
            stdTTL: 24 * 60 * 60,
            checkperiod: 60 * 60
        });
    }

    generateKey(text) {
        return crypto
            .createHash('md5')
            .update(text)
            .digest('hex');
    }

    async getOrSet(key, dataFn) {
        const cached = this.cache.get(key);
        if (cached) {
            console.log('Cache hit for key:', key);
            return cached;
        }

        const data = await dataFn();
        this.cache.set(key, data);
        return data;
    }
}

export default new CacheService();