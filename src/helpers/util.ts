import { randomInt } from 'crypto';

const ONE_TIME_CODE_LENGTH: number = 6;
const MAX_ONE_TIME_CODE: number = parseInt('9'.repeat(ONE_TIME_CODE_LENGTH), 10) + 1;

function generateOneTimeCode(): string {
    const randomNumString = randomInt(MAX_ONE_TIME_CODE).toString(10);
    return randomNumString.padStart(ONE_TIME_CODE_LENGTH, '0');
}

export async function generateUniqueOneTimeCode(isCodeUnique: (key: string) => Promise<boolean>): Promise<string> {
    let isCodeAlreadyUsed: boolean  = false;
    let code: string;

    do {
        try {
            code = generateOneTimeCode();
            isCodeAlreadyUsed = await isCodeUnique(code);
        } catch (err) {
            console.error(`Error occurred while attempting to generate unique one time code: ${err}`);
            return '';
        }
    } while (isCodeAlreadyUsed);

    return code;
}