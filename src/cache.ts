import NodeCache from 'node-cache';
import { Cache, SDPData } from './schemas';

export const SDP_ENTRY_TTL_IN_SECONDS: number = 600; // 10 minutes

export function createSDPCache(): Cache<SDPData> {
    const sdpCache = new NodeCache();

    return {
        get: (key: string): SDPData | undefined => {
            return sdpCache.get(key);
        },
        set: (key: string, value: SDPData, ttl: number): boolean => {
            return sdpCache.set(key, value, ttl);
        },
        del: (key: string): boolean => {
            return sdpCache.del(key) > 0;
        },
    };
}