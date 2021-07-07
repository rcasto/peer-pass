import { File, Storage } from '@google-cloud/storage';
import { SDPData, SDPDataWithExpiry } from './schemas';

const PEER_PASS_BUCKET_NAME = 'peer-pass';
const SDP_ENTRY_TTL_IN_MS: number = 1000 * 60 * 10; // 10 minutes
const SDP_ENTRY_TTL_BUFFER: number = 1000 * 60 * 1; // 1 minute

const storage = new Storage();
const peerPassBucket = storage.bucket(PEER_PASS_BUCKET_NAME);

function isExpired(sdpWithExpiryEntry: SDPDataWithExpiry): boolean {
    if (!sdpWithExpiryEntry || typeof sdpWithExpiryEntry.expiresAt !== 'number') {
        return false;
    }

    const now = Date.now();
    return sdpWithExpiryEntry.expiresAt > 0 && sdpWithExpiryEntry.expiresAt < (now + SDP_ENTRY_TTL_BUFFER);
}

function getFileNameForKey(key: string): string {
    return `${key}.json`;
}

async function findFileByName(fileName: string): Promise<File | null> {
    try {
        const [
            [file],
        ] = await peerPassBucket.getFiles({
            prefix: fileName,
            maxResults: 1,
        });

        return file;
    } catch (err) {
        console.error(`Error occurred while finding file with name ${fileName} in blob: ${err}`);
        return null;
    }
}

function get(key: string): Promise<SDPDataWithExpiry | null> {
    return new Promise(async (resolve) => {
        const fileName = getFileNameForKey(key);
        const sdpFile = await findFileByName(fileName);

        if (!sdpFile) {
            return resolve(null);
        }

        const fileReadableStream = sdpFile.createReadStream();
        let sdpFileContents = '';

        fileReadableStream.on('data', (chunk: string) => {
            sdpFileContents += chunk;
        });
        fileReadableStream.on('end', async () => {
            try {
                const sdpWithExpiry: SDPDataWithExpiry = JSON.parse(sdpFileContents);

                if (isExpired(sdpWithExpiry)) {
                    await del(key);
                    resolve(null);
                } else {
                    resolve(sdpWithExpiry);
                }
            } catch (err) {
                console.error(`Error occurred while parsing file ${fileName} contents as JSON: ${err}`);
                resolve(null);
            }
        });
        fileReadableStream.on('error', err => {
            console.error(`Error occurred while reading file ${fileName}: ${err}`);
            resolve(null);
        });
    });
}

async function set(key: string, value: SDPData): Promise<boolean> {
    const fileName = getFileNameForKey(key);
    const file = peerPassBucket.file(fileName);
    const sdpWithExpiry: SDPDataWithExpiry = {
        ...value,
        expiresAt: Date.now() + SDP_ENTRY_TTL_IN_MS,
    };

    try {
        await file.save(JSON.stringify(sdpWithExpiry), {
            contentType: 'application/json',
        });

        return true;
    } catch (err) {
        console.error(`Error occurred while writing file ${fileName} to blob: ${err}`);
        return false;
    }
}

async function del(key: string): Promise<boolean> {
    const fileName = getFileNameForKey(key);
    const file = await findFileByName(fileName);

    if (!file) {
        return false;
    }

    try {
        await file.delete();

        return true;
    } catch (err) {
        console.error(`Error occurred while deleting file ${fileName}: ${err}`);
        return false;
    }
}

async function has(key: string): Promise<boolean> {
    const fileName = getFileNameForKey(key);
    const file = await findFileByName(fileName);

    return !!file;
}

export const BlobCache = {
    get,
    set,
    del,
    has,
};