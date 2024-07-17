import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Airdrop: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Quiz</title>
        <meta
          name="description"
          content="Solana Quiz"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Airdrop;
