import type { NextPage } from "next";
import Footer from "~~/components/common/Footer";
import LSDPool from "~~/components/leading/LSDPool";
import Pools from "~~/components/leading/Pools";
import ValueLocked from "~~/components/leading/ValueLocked";

const Home: NextPage = () => {
  return (
    <>
      <main className="w-screen bg-white h-[--main-height] overflow-y-scroll page-bg flex flex-col items-center justify-between pt-[50px] pb-[60px]">
        <div className="flex flex-col items-center">
          <ValueLocked></ValueLocked>
          <div className="mt-[73px]">
            <Pools></Pools>
          </div>
          <div className="flex flex-col items-center mt-[50px]">
            <div className="bg-white w-[231px] h-[54px] flex items-center justify-center rounded-[10px] text-lg font-semibold">
              Isolated Pools
            </div>
            <div className="mt-30px">
              <LSDPool></LSDPool>
            </div>
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
