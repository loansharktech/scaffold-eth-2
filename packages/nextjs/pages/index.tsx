import Head from "next/head";
import type { NextPage } from "next";
import Footer from "~~/components/common/Footer";
import Pools from "~~/components/leading/Pools";
import ValueLocked from "~~/components/leading/ValueLocked";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Lending</title>
        <meta name="description" content="Loanshark Scroll Alpha Testnet" />
      </Head>
      <main className="w-screen bg-white h-[--main-height] overflow-y-scroll page-bg flex flex-col items-center justify-between pt-[50px] pb-[60px]">
        <div className="flex flex-col items-center">
          <ValueLocked></ValueLocked>
          <div className="mt-[73px]">
            <Pools></Pools>
          </div>
        </div>
        <div className="mt-20 sm:mt-[178px]">
          <Footer></Footer>
        </div>
      </main>
    </>
  );
};

export default Home;
