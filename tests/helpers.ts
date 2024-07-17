import {PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import crypto from "crypto";


export const QUIZ_SEED= "QUIZ_SEED";
export const STATISTIC_SEED = "STATISTIC_SEED";

export function getContentSeed(question: string): Uint8Array {
    let hexString = crypto.createHash('sha256').update(question, 'utf-8').digest('hex');
    return Uint8Array.from(Buffer.from(hexString, 'hex'));
}

export function getQuizAddress(question: string, author: PublicKey, programID: PublicKey) {
    const content_seed = getContentSeed(question);
    return PublicKey.findProgramAddressSync(
        [
            content_seed,
            anchor.utils.bytes.utf8.encode(QUIZ_SEED),
            author.toBuffer()
        ], programID);
}
