import { randomInt } from 'crypto';
import { Cache, SDPData } from '../schemas';

const ONE_TIME_CODE_LENGTH: number = 6;
const MAX_ONE_TIME_CODE: number = parseInt('9'.repeat(ONE_TIME_CODE_LENGTH), 10) + 1;

function generateOneTimeCode(): string {
    const randomNumString = randomInt(MAX_ONE_TIME_CODE).toString(10);
    return randomNumString.padStart(ONE_TIME_CODE_LENGTH, '0');
}

export function generateUniqueOneTimeCode(cache: Cache<SDPData>): string {
    let isCodeAlreadyUsed: boolean  = false;
    let code: string;

    do {
        code = generateOneTimeCode();
        isCodeAlreadyUsed = !!cache.get(code);
    } while (isCodeAlreadyUsed);

    return code;
}