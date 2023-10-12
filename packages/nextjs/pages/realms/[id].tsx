import { useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Footer from "~~/components/common/Footer";
import RealmHeader from "~~/components/realm/Header";
import RealmOverview from "~~/components/realm/Overview";
import SideMenu from "~~/components/realm/SideMenu";
import TokenList from "~~/components/realm/TokenList";
import { realms } from "~~/configs/pool";
import { useRealm } from "~~/hooks/useRealm";
import { useTypedSelector } from "~~/stores";

const RealmPage: NextPage = () => {
  const { query } = useRouter();
  const { id } = query;
  const realmInfo = realms.find(item => {
    return item.id === id;
  });

  const { realm, refetch } = useRealm(realmInfo?.id || "main");

  const stepIndexTrack = useTypedSelector(state => {
    return (
      state.trade.borrow.stepIndex +
      state.trade.repay.stepIndex +
      state.trade.supply.stepIndex +
      state.trade.withdraw.stepIndex +
      state.trade.collateralTrigger
    );
  });

  useEffect(() => {
    refetch();
  }, [stepIndexTrack]);

  return (
    <>
      <main className="bg-white h-[--main-height] flex flex-col sm:flex-row">
        <SideMenu></SideMenu>
        <div className="flex-1 page-bg h-full overflow-y-scroll">
          <div className="max-w-[1155px] mx-auto pt-[33px] px-4 h-full">
            {!realm ? (
              <div></div>
            ) : (
              <div className="flex flex-col h-full">
                <RealmHeader realm={realm}></RealmHeader>
                <RealmOverview className="mt-4" realm={realm}></RealmOverview>
                <TokenList className="mt-4" realm={realm}></TokenList>
                <div className="flex-1"></div>
                <div className="pt-20 pb-14 w-full flex justify-center">
                  <Footer></Footer>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default RealmPage;
