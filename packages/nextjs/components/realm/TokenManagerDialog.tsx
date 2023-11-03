import { FunctionComponent } from "react";
import { CloseButton, Modal, Progress, SegmentedControl } from "@mantine/core";
import BigNumber from "bignumber.js";
import Stepper from "~~/components/common/Stepper";
import TokenBorrow from "~~/components/realm/TokenBorrow";
import TokenRepay from "~~/components/realm/TokenRepay";
import TokenSupply from "~~/components/realm/TokenSupply";
import TokenWithdraw from "~~/components/realm/TokenWithdraw";
import { useDevice } from "~~/hooks/useDevice";
import { Market, Realm } from "~~/hooks/useRealm";
import store, { actions, useTypedSelector } from "~~/stores";
import { TradeType } from "~~/stores/reducers/trade";
import { amountDesc } from "~~/utils/amount";

const TokenManagerDialog: FunctionComponent<{
  market: Market | null;
  onChangeMarket: any;
  opened: boolean;
  realm: Realm;
  setOpened: any;
}> = ({ market, realm, opened, setOpened, onChangeMarket }) => {
  const steps = [
    {
      label: "Enter Amount",
      className: "",
    },
    {
      label: "Approve",
      className: "-ml-[20px]",
    },
    {
      label: "Execute",
      className: "-ml-[40px]",
    },
  ];
  const { isMobile } = useDevice();
  const trade = useTypedSelector(state => {
    return state.trade;
  });

  const tradeType = trade.tradeType;

  const tradeData = trade[tradeType];

  const borrowed = amountDesc(realm.totalUserBorrowed, 2);
  const limit = amountDesc(realm.totalUserLimit, 2);
  const collateral = realm.deposit ? amountDesc(realm.deposit, 2) : (0).toFixed(2);
  const userBorrowLimit = realm.userBorrowLimit ? realm.userBorrowLimit.multipliedBy(100) : new BigNumber(0);

  if (!market) {
    return null;
  }

  return (
    <Modal
      classNames={{
        content: "bg-transparent shadow-none scrollbar-hide",
        body: "px-0",
        root: "scrollbar-hide",
      }}
      size={"lg"}
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
      withCloseButton={false}
      overlayProps={{
        opacity: 0.8,
        blur: 3,
      }}
    >
      <div className="text-white text-[32px] font-bold flex items-center justify-between">
        <span>{market.token}</span>
        <CloseButton
          size="lg"
          className="text-white !bg-transparent action"
          onClick={() => {
            setOpened(false);
          }}
        ></CloseButton>
      </div>
      <div className="mt-5">
        <Stepper steps={steps} active={tradeData.stepIndex}></Stepper>
      </div>
      <div className="mt-12 w-full">
        <SegmentedControl
          value={tradeType}
          onChange={type => {
            store.dispatch(actions.trade.changeTradeType(type as TradeType));
          }}
          size={isMobile ? "sm" : "xl"}
          color="blue"
          radius="md"
          classNames={{
            root: "w-full",
          }}
          data={[
            { label: "Supply", value: TradeType.Supply },
            { label: "Borrow", value: TradeType.Borrow },
            { label: "Withdraw", value: TradeType.Withdraw },
            { label: "Repay", value: TradeType.Repay },
          ]}
        />
      </div>
      <div className="bg-white mt-5 rounded-md p-5">
        {tradeType === TradeType.Supply && (
          <TokenSupply market={market} realm={realm} onChangeMarket={onChangeMarket}></TokenSupply>
        )}
        {tradeType === TradeType.Borrow && (
          <TokenBorrow market={market} realm={realm} onChangeMarket={onChangeMarket}></TokenBorrow>
        )}
        {tradeType === TradeType.Withdraw && (
          <TokenWithdraw market={market} realm={realm} onChangeMarket={onChangeMarket}></TokenWithdraw>
        )}
        {tradeType === TradeType.Repay && (
          <TokenRepay market={market} realm={realm} onChangeMarket={onChangeMarket}></TokenRepay>
        )}
      </div>
      <div className="bg-white rounded-md mt-5 p-5 rounded-r-lg flex">
        <div className="flex-1">
          <div>Your Borrow Utilization</div>
          <div className="mt-[11px] flex items-center">
            <div className="font-bold text-[22px] flex-shrink-0">{amountDesc(userBorrowLimit, 2)}%</div>
            <div className="ml-3 flex-1">
              <Progress
                value={userBorrowLimit.toNumber()}
                classNames={{
                  root: "bg-[#CFE7FC]",
                  bar: "bg-blue",
                }}
              />
            </div>
          </div>
        </div>
        <div className="text-[#9CA3AF] text-sm w-[110px] flex flex-col gap-1 ml-10 flex-shrink-0">
          <div className="flex justify-end">
            <span>Borrowed</span>
            <span className="text-[#2679B8] ml-[6px]">${borrowed}</span>
          </div>
          <div className="flex justify-end">
            <span>Limit</span>
            <span className="text-[#2679B8] ml-[6px]">${limit}</span>
          </div>
          <div className="flex justify-end">
            <span>Collateral</span>
            <span className="text-[#2679B8] ml-[6px]">${collateral}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TokenManagerDialog;
