import { File, Storage } from '@google-cloud/storage';
import { SDPData } from './schemas';

const PEER_PASS_BUCKET_NAME = 'peer-pass';
const SDP_ENTRY_TTL_IN_MS: number = 1000 * 60 * 10; // 10 minutes
const SDP_ENTRY_TTL_BUFFER: number = 1000 * 60 * 1; // 1 minute

const storage = new Storage();
const peerPassBucket = storage.bucket(PEER_PASS_BUCKET_NAME);

function isExpired(file: File): boolean {
    if (!file || !file.metadata || typeof file.metadata.timeCreated !== 'string') {
        return false;
    }

    const timeCreatedDate = new Date(file.metadata.timeCreated);
    const expiresAt = timeCreatedDate.getTime() + SDP_ENTRY_TTL_IN_MS + SDP_ENTRY_TTL_BUFFER;

    return Date.now() < expiresAt;
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

function get(key: string): Promise<SDPData | null> {
    return new Promise(async (resolve) => {
        const fileName = getFileNameForKey(key);
        const sdpFile = await findFileByName(fileName);

        if (!sdpFile) {
            return resolve(null);
        }

        if (isExpired(sdpFile)) {
            await del(key);
            return resolve(null);
        }

        const fileReadableStream = sdpFile.createReadStream();
        let sdpFileContents = '';

        fileReadableStream.on('data', (chunk: string) => {
            sdpFileContents += chunk;
        });
        fileReadableStream.on('end', async () => {
            try {
                const sdpWithExpiry: SDPData = JSON.parse(sdpFileContents);
                resolve(sdpWithExpiry);
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
    const sdpWithExpiry: SDPData = {
        ...value,
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