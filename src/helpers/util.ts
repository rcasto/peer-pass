import { randomInt } from 'crypto';
import { ErrorWrapper, WrapErrorInput } from '../schemas';

const ONE_TIME_CODE_LENGTH: number = 6;
const MAX_ONE_TIME_CODE: number = parseInt('9'.repeat(ONE_TIME_CODE_LENGTH), 10) + 1;
const MAX_ONE_TIME_CODE_GENERATE_ATTEMPTS: number = 25;

function generateOneTimeCode(): string {
    const randomNumString = randomInt(MAX_ONE_TIME_CODE).toString(10);
    return randomNumString.padStart(ONE_TIME_CODE_LENGTH, '0');
}

export async function generateUniqueOneTimeCode(isCodeUnique: (key: string) => Promise<boolean>): Promise<string> {
    let isCodeAlreadyUsed: boolean  = false;
    let numCycles: number = 0;
    let code: string;

    do {
        try {
            if (numCycles > MAX_ONE_TIME_CODE_GENERATE_ATTEMPTS) {
                throw new Error('Max cycles reached when attempting to generate a unique one time code.');
            }

            code = generateOneTimeCode();
            isCodeAlreadyUsed = await isCodeUnique(code);
            numCycles++;
        } catch (err) {
            throw wrapError({
                source: generateUniqueOneTimeCode,
                message: 'Error occurred while attempting to generate unique one time code',
                err,
            });
        }
    } while (isCodeAlreadyUsed);

    return code;
}

export function wrapError({ 
    source,
    message,
    err,
}: WrapErrorInput): ErrorWrapper {
    return {
        source: source.name,
        message,
        err,
    };
}

export function handleError(err: any): void {
    const wrappedError: ErrorWrapper = err;
    console.error(`${wrappedError.source}: ${wrappedError.message}`, wrappedError.err);
}