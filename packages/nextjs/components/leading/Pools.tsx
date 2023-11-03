import type { FunctionComponent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "~~/components/common/icons";
import { realms } from "~~/configs/pool";
import { useRealm } from "~~/hooks/useRealm";
import { amountDesc } from "~~/utils/amount";

const Pools: FunctionComponent = () => {
  const defaultPool = realms[0];
  const { realm } = useRealm(defaultPool.id);

  const netAPY = realm.netAPY ? realm.netAPY.multipliedBy(100).toNumber() : 0;
  const deposit = realm.deposit ? amountDesc(realm.deposit, 2) : 0;
  const totalSupply = amountDesc(realm.totalSupply, 0);
  const totalBorrow = amountDesc(realm.totalBorrow, 0);

  return (
    <div className="flex flex-col items-center mx-4">
      <Link href={`/realms/${defaultPool.id}`}>
        <div className="mt-7 bg-white/80 rounded-lg sm:w-[872px] px-4 sm:px-8 py-7 pb-[43px] action">
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
          <div className="w-full flex flex-wrap justify-center  sm:justify-between gap-x-8 sm:gap-x-0 gap-y-4 mt-12">
            <div className="flex flex-col ml-2 gap-8 sm:gap-[41px] leading-none">
              <div>
                <div>Your Net APY</div>
                <div className={`text-[28px] font-bold number mt-1 ${netAPY <= 0 ? "text-green" : ""}`}>
                  {netAPY.toFixed(2)}%
                </div>
              </div>
              <div>
                <div>Amount Deposited</div>
                <div className="text-[28px] font-bold mt-1 number">${deposit}</div>
              </div>
            </div>
            <div className="flex flex-col gap-y-6 sm:gap-y-[57px] leading-none">
              <div className="flex flex-col sm:flex-row">
                <span>Total Supply</span>
                <div className="text-4xl number font-bold sm:ml-[10px] mt-1 sm:-mt-1 leading-none">${totalSupply}</div>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span>Total Borrow</span>
                <div className="text-4xl number font-bold sm:ml-[10px] mt-1 sm:-mt-1 leading-none">${totalBorrow}</div>
              </div>
            </div>
            <div className="flex sm:mr-[50px] sm:flex-row flex-col sm:items-start items-center leading-none">
              <div className="sm:mr-[17px]">Assets</div>
              <div className="flex flex-col gap-2 w-fit">
                {realm?.markets?.map(market => {
                  const cToken = realm[market.address];
                  return (
                    <div key={market.address} className="flex gap-[10px] items-center text-xl">
                      {cToken?.token?.icon && (
                        <img className="w-7 h-auto object-contain" src={cToken?.token?.icon} alt="Img" />
                      )}
                      <span className="font-bold number">${amountDesc(cToken?.value, 2)}</span>
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
