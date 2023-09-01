import Head from "next/head";
import type { NextPage } from "next";
import Footer from "~~/components/common/Footer";
import Pools from "~~/components/leading/Pools";
import ValueLocked from "~~/components/leading/ValueLocked";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Loanshark</title>
        <meta name="description" content="Risk-Isolated Money Market on Scroll" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
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
