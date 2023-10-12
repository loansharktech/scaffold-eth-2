import type { NextPage } from "next";
import Footer from "~~/components/common/Footer";
import { RightOutlinedIcon } from "~~/components/common/icons";

const bridges = [
  {
    label: "Scroll Native Bridge",
    desc: "Official Bridge to transfer funds between Ethereum Mainnet and Scroll.",
    link: "https://scroll.io/bridge",
    icon: "/assets/scroll.png",
  },
  {
    label: "Squid Router",
    desc: "Squid is a cross-chain liquidity router that allows users to swap their assets between blockchains and access applications across chains.",
    link: "https://app.squidrouter.com/",
    icon: "/assets/squid.png",
  },
];

const Home: NextPage = () => {
  return (
    <>
      <main className="w-screen bg-white h-[--main-height] overflow-y-scroll page-bg flex flex-col items-center  pt-[50px] pb-[60px]">
        <div className="flex flex-col items-center px-5">
          <div className="text-[32px] font-semibold">Bridging the Gap</div>
          <div className="mt-2 text-center max-w-[500px]">
            Scroll seamlessly extends Ethereum’s capabilities through zero knowledge tech and EVM equivalence.
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-5 sm:px-24 mt-[47px]">
          <div className="text-center text-[21px] font-semibold text-[#538EE4]">Choose a bridge</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-[17px]">
            {bridges.map((bridge, index) => {
              return (
                <a
                  href={bridge.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex bg-white rounded-[18px] p-[19px] pl-[27px] action"
                  key={index}
                >
                  <div>
                    <div className="flex items-center">
                      <img src={bridge.icon} className="w-[30px] h-[30px] rounded-full" alt="" />
                      <div className="text-[17px] font-medium ml-3">{bridge.label}</div>
                    </div>
                    <div className="mt-[15px] text-[13px] font-medium">{bridge.desc}</div>
                  </div>
                  <div className="ml-[9px] self-center">
                    <RightOutlinedIcon></RightOutlinedIcon>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="mt-20 sm:mt-[178px]">
          <Footer></Footer>
        </div>
      </main>
    </>
  );
};

export default Home;
