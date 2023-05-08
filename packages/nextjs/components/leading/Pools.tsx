import type { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "~~/components/common/icons";
import { realms, tokens } from "~~/configs/pool";

const Pools: FunctionComponent = () => {
  const defaultPool = realms[0];

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white w-[231px] h-[54px] flex items-center justify-center rounded-[10px]">Pools</div>
      <Link href={`/realms/${defaultPool.id}`}>
        <div className="mt-7 bg-white/80 rounded-lg w-[872px] px-8 py-7 pb-[43px] action">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image alt="pool icon" src={defaultPool.icon} width={47} height={47}></Image>
              <div className="ml-4 text-2xl font-medium text-dark2">{defaultPool.name}</div>
              <ArrowRightIcon className="ml-[10px]"></ArrowRightIcon>
            </div>
            <div className="w-14 h-8 flex items-center justify-center bg-[#1B2736] rounded-2xl text-white/80 text-sm">
              Main
            </div>
          </div>
          <div className="w-full flex justify-between gap-y-4 mt-12">
            <div className="flex flex-col ml-2 gap-6">
              <div>
                <div>Your Net APY</div>
                <div className="text-[28px] font-bold text-green mt-1">0.00%</div>
              </div>
              <div>
                <div>Amount Deposited</div>
                <div className="text-[28px] font-bold mt-1">0.00%</div>
              </div>
            </div>
            <div className="flex flex-col gap-y-[57px] items-center">
              <div className="flex">
                <span>Total Supply</span>
                <div className="text-4xl font-bold ml-[10px]">$8M</div>
              </div>
              <div className="flex">
                <span>Total borrow</span>
                <div className="text-4xl font-bold ml-[10px]">$2M</div>
              </div>
            </div>
            <div className="flex mr-[50px]">
              <div className="mr-[17px]">Assets</div>
              <div className="flex flex-col gap-2 w-fit">
                {tokens.map(token => {
                  return (
                    <div key={token.name} className="flex gap-[10px] items-center text-[28px]">
                      <img className="w-7 h-auto object-contain" src={token.icon} alt="Img" />
                      <span className="font-bold">$4.51M</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Pools;
