import { FunctionComponent, useState } from "react";
import { CloseButton, Modal, Progress, SegmentedControl } from "@mantine/core";
import Stepper from "~~/components/common/Stepper";
import TokenBorrow from "~~/components/realm/TokenBorrow";
import TokenRepay from "~~/components/realm/TokenRepay";
import TokenSupply from "~~/components/realm/TokenSupply";
import TokenWithdraw from "~~/components/realm/TokenWithdraw";
import { Token, tokens } from "~~/configs/pool";
import { useDevice } from "~~/hooks/useDevice";

const TokenManagerDialog: FunctionComponent<{
  token: Token | null;
  onChangeToken: any;
  opened: boolean;
  setOpened: any;
}> = ({ token, opened, setOpened, onChangeToken }) => {
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
  const [stepIndex] = useState(0);
  const [tab, setTab] = useState("Supply");
  const { isMobile } = useDevice();

  if (!token) {
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
        <span>{token.name.toUpperCase()}</span>
        <CloseButton
          size="lg"
          className="text-white !bg-transparent action"
          onClick={() => {
            setOpened(false);
          }}
        ></CloseButton>
      </div>
      <div className="mt-5">
        <Stepper steps={steps} active={stepIndex}></Stepper>
      </div>
      <div className="mt-12 w-full">
        <SegmentedControl
          value={tab}
          onChange={setTab}
          size={isMobile ? "sm" : "xl"}
          color="blue"
          radius="md"
          classNames={{
            root: "w-full",
          }}
          data={[
            { label: "Supply", value: "Supply" },
            { label: "Borrow", value: "Borrow" },
            { label: "Withdraw", value: "Withdraw" },
            { label: "Repay", value: "Repay" },
          ]}
        />
      </div>
      <div className="bg-white mt-5 rounded-md p-5">
        {tab === "Supply" && (
          <TokenSupply
            token={token}
            onChangeToken={(name: string) => {
              onChangeToken(
                tokens.find(token => {
                  return token.name === name;
                }),
              );
            }}
          ></TokenSupply>
        )}
        {tab === "Borrow" && (
          <TokenBorrow
            token={token}
            onChangeToken={(name: string) => {
              onChangeToken(
                tokens.find(token => {
                  return token.name === name;
                }),
              );
            }}
          ></TokenBorrow>
        )}
        {tab === "Withdraw" && (
          <TokenWithdraw
            token={token}
            onChangeToken={(name: string) => {
              onChangeToken(
                tokens.find(token => {
                  return token.name === name;
                }),
              );
            }}
          ></TokenWithdraw>
        )}
        {tab === "Repay" && (
          <TokenRepay
            token={token}
            onChangeToken={(name: string) => {
              onChangeToken(
                tokens.find(token => {
                  return token.name === name;
                }),
              );
            }}
          ></TokenRepay>
        )}
      </div>
      <div className="bg-white rounded-md mt-5 p-5 rounded-r-lg flex">
        <div className="flex-1">
          <div>Your Borrow Limit</div>
          <div className="mt-[11px] flex items-center">
            <div className="font-bold text-[22px] flex-shrink-0">0.00%</div>
            <div className="ml-3 flex-1">
              <Progress
                value={50}
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
            <span className="text-[#2679B8] ml-[6px]">$0.00</span>
          </div>
          <div className="flex justify-end">
            <span>Limit</span>
            <span className="text-[#2679B8] ml-[6px]">$0.00</span>
          </div>
          <div className="flex justify-end">
            <span>Collateral</span>
            <span className="text-[#2679B8] ml-[6px]">$0.00</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TokenManagerDialog;
