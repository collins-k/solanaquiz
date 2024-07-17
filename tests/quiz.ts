import dotenv from "dotenv";

dotenv.config();
import * as anchor from "@coral-xyz/anchor";
import {Program} from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js";
import {getKeypairFromEnvironment} from "@solana-developers/helpers";
import {Quiz} from "../target/types/quiz";
import {assert} from "chai";
import {getQuizAddress} from "./helpers";

describe("quiz", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Quiz as Program<Quiz>;
    const keypair = getKeypairFromEnvironment("SECRET_KEY");
    const keypair2 = getKeypairFromEnvironment("SECRET_KEY_2");

    const { question, response, a__1, a__2, a__3, a__4 } = {
        question: Date.now().toString(),
        response: "140",
        a__1: "140",
        a__2: "160",
        a__3: "100",
        a__4: "3"
    };

    let question2 = `1${question}`;

    const new_quiz = {
        response: "New response",
        a__1: "New response",
        a__2: "new_a2",
        a__3: "new_a3",
        a__4: "new_a4",
    }

    describe("Initialize Quiz", async () => {

        it("Should initialize Quiz!", async () => {
            const [quiz_pkey, quiz_bump] = getQuizAddress(question, keypair.publicKey, program.programId);
            await program.methods.initialize(question, response, a__1, a__2, a__3, a__4).accounts(
                {
                    quizAuthority: keypair.publicKey,
                    quiz: quiz_pkey,
                }
            ).signers([keypair]).rpc({skipPreflight: true})

            await checkQuiz(
                program, quiz_pkey, keypair.publicKey, question, response, a__1, a__2, a__3, a__4, quiz_bump
            )
        });

        it("Cannot initialize quiz with question longer than 300 bytes!", async () => {
            let should_fail = "This Should Fail"
            try {
                const maxQuestion = `ten bytes!`.repeat(31);
                const [quiz_pkey,] = getQuizAddress(maxQuestion, keypair.publicKey, program.programId);

                await program.methods.initialize(maxQuestion, response, a__1, a__2, a__3, a__4).accounts(
                    {
                        quizAuthority: keypair.publicKey,
                        quiz: quiz_pkey,
                        systemProgram: anchor.web3.SystemProgram.programId
                    }
                ).signers([keypair]).rpc()

            } catch (error) {
                const err = anchor.AnchorError.parse(error.logs);
                assert.strictEqual(err.error.errorCode.code, "QuestionTooLong");
                should_fail = "Failed"
            }
            assert.strictEqual(should_fail, "Failed")
        });

        it("Should initialize second Quiz with keypair!", async () => {
            const {question, response, a__1, a__2, a__3, a__4} = {
                question: `${question2}`,
                response: "14",
                a__1: "14",
                a__2: "16",
                a__3: "25",
                a__4: "10"
            }
            const [quiz_pkey, quiz_bump] = getQuizAddress(question, keypair.publicKey, program.programId);

            await program.methods.initialize(question, response, a__1, a__2, a__3, a__4).accounts(
                {
                    quizAuthority: keypair.publicKey,
                    quiz: quiz_pkey,
                    systemProgram: anchor.web3.SystemProgram.programId
                }
            ).signers([keypair]).rpc({skipPreflight: true})

            await checkQuiz(
                program, quiz_pkey, keypair.publicKey, question, response, a__1, a__2, a__3, a__4, quiz_bump
            )
        });
    });

    describe("Edit Quiz", async () => {
        it("Should edit Quiz!", async () => {
            const [quiz_pkey, quiz_bump] = getQuizAddress(question, keypair.publicKey, program.programId);

            await program.methods.update(question, new_quiz.response, new_quiz.a__1, new_quiz.a__2, new_quiz.a__3, new_quiz.a__4).accounts(
                {
                    quizAuthority: keypair.publicKey,
                    quiz: quiz_pkey,
                }
            ).signers([keypair]).rpc({ commitment: "confirmed"})

            await checkQuiz(
                program, quiz_pkey, keypair.publicKey, question, new_quiz.response, new_quiz.a__1, new_quiz.a__2, new_quiz.a__3, new_quiz.a__4, quiz_bump
            )
        });

        it("Cannot edit quiz if the signer is not the author!", async () => {
            let should_fail = "This Should Fail"
            try {
                const [quiz_pkey,] = getQuizAddress(question, keypair.publicKey, program.programId);

                await program.methods.update(question, new_quiz.response, new_quiz.a__1, new_quiz.a__2, new_quiz.a__3, new_quiz.a__4).accounts(
                    {
                        quizAuthority: keypair.publicKey,
                        quiz: quiz_pkey,
                        systemProgram: anchor.web3.SystemProgram.programId
                    }
                ).signers([keypair2]).rpc({ commitment: "confirmed"})

            } catch (error) {
                assert.isTrue(error.toString().includes("unknown signer"), "Only the quiz owner can modify its data");
                should_fail = "Failed"
            }
            assert.strictEqual(should_fail, "Failed")
        });
    });

    describe("Answer Quiz", () => {
        it("Should answer quiz incorrectly", async () => {
            let should_fail = "This Should Fail"
            const [quiz_pkey, quiz_bump] = getQuizAddress(question, keypair.publicKey, program.programId);
            try {
                await program.methods.answer("Something random").accounts(
                    {
                        quiz: quiz_pkey,
                    }
                ).signers([]).rpc( { commitment: "confirmed"})
            } catch (error) {
                const err = anchor.AnchorError.parse(error.logs);
                assert.strictEqual(err.error.errorCode.code, "IncorrectAnswer");
                should_fail = "Failed"
            }
            assert.strictEqual(should_fail, "Failed")
            let quizData = await program.account.quiz.fetch(quiz_pkey);
            assert.isFalse(quizData.isAnswered);
        })

        // edit quiz test changed the quiz state
        it("Should answer quiz correctly", async () => {
            const [quiz_pkey, quiz_bump] = getQuizAddress(question, keypair.publicKey, program.programId);
            await program.methods.answer(new_quiz.response).accounts(
                {
                    quiz: quiz_pkey,
                }
            ).signers([]).rpc({ commitment: "confirmed"})

            let quizData = await program.account.quiz.fetch(quiz_pkey);
            assert.isTrue(quizData.isAnswered);
        })
    })

    describe("Delete Quiz", () => {

        [question, question2].forEach(function(value) {
            it(`Should delete quiz with question ${value}!`, async () => {
                const [quiz_pkey, quiz_bump] = getQuizAddress(value, keypair.publicKey, program.programId);
                await program.methods.delete(value).accounts(
                    {
                        quizAuthority: keypair.publicKey,
                        quiz: quiz_pkey,
                    }
                ).signers([keypair]).rpc({ skipPreflight: true})

                let thisShouldFail = "This should fail"
                try {
                    await program.account.quiz.fetch(quiz_pkey);
                } catch (error) {
                    thisShouldFail = "Failed"
                    assert.isTrue(error.message.includes("Account does not exist or has no data"))
                }
                assert.strictEqual(thisShouldFail, "Failed")

            });
        });
    })

});


async function checkQuiz(
    program: anchor.Program<Quiz>,
    quiz: PublicKey,
    quiz_author: PublicKey,
    question: string,
    response: string,
    a__1: string,
    a__2: string,
    a__3: string,
    a__4: string,
    bump: number,
    is_answer: boolean = false,
) {
    let quizData = await program.account.quiz.fetch(quiz);

    assert.strictEqual(quizData.quizAuthor.toBase58(), quiz_author.toBase58())
    assert.strictEqual(quizData.question, question)
    assert.strictEqual(quizData.a1, a__1)
    assert.strictEqual(quizData.a2, a__2)
    assert.strictEqual(quizData.a3, a__3)
    assert.strictEqual(quizData.a4, a__4)
    assert.strictEqual(quizData.isAnswered, is_answer)
    assert.strictEqual(quizData.bump.toString(), bump.toString())
}
