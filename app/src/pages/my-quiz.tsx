import type { NextPage } from "next";
import Head from "next/head";
import {MyQuizView} from "../views";

const MyQuiz: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Solana Quiz</title>
                <meta
                    name="description"
                    content="Solana Quiz"
                />
            </Head>
            <MyQuizView />
        </div>
    );
};

export default MyQuiz;
