import type { NextPage } from "next";
import Head from "next/head";
import { QuizView } from "../views";

const Index: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <QuizView />
    </div>
  );
};

export default Index;
