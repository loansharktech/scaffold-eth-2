import type { FC } from "react";
import Image from "next/image";
import { Menu } from "@mantine/core";
import { useSwitchNetwork } from "wagmi";
import { ArrowLeftOnRectangleIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useAccountBalance } from "~~/hooks/scaffold-eth";
import { useAccount } from "~~/hooks/useAccount";
import { trimAddr } from "~~/utils/format";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const ConnectWallet: FC = () => {
  const { isLogin, login, address, logout, chain } = useAccount();

  const { balance } = useAccountBalance(address);
  const targetNetwork = getTargetNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const invalidNetwork = chain?.id !== targetNetwork.id;

  return (
    <div className="flex gap-3 items-center">
      {!isLogin && (
        <div className="py-[10px] px-5 rounded-lg bg-[#C6DFEC] action " onClick={login}>
          Connect Wallet
        </div>
      )}
      {isLogin && (
        <>
          {!invalidNetwork && (
            <div className="flex items-center py-1 px-3 border border-[#C6DFEC] rounded-lg action">
              <Image src="/logo-s.png" width={35} height={35} alt="logo"></Image>
              <span className="font-medium ml-2 text-gray-400">{balance?.toFixed(2)}</span>
            </div>
          )}

          <Menu shadow="md" position="bottom-end" width={200}>
            <Menu.Target>
              {invalidNetwork ? (
                <div className="py-[10px] px-5 rounded-lg bg-red-500 text-white action">WRONG NETWORK</div>
              ) : (
                <div className="py-[10px] px-5 rounded-lg bg-bg_dark text-white action">
                  {trimAddr(address as string, 4, 4)}
                </div>
              )}
            </Menu.Target>
            <Menu.Dropdown>
              {invalidNetwork && (
                <Menu.Item
                  onClick={() => {
                    switchNetwork?.(targetNetwork.id);
                  }}
                  icon={<ArrowsRightLeftIcon className="h-6 w-4"></ArrowsRightLeftIcon>}
                >
                  <div>
                    <span>Switch to </span>
                    <span>{targetNetwork.name}</span>
                  </div>
                </Menu.Item>
              )}
              <Menu.Item
                icon={<ArrowLeftOnRectangleIcon className="h-6 w-4"></ArrowLeftOnRectangleIcon>}
                onClick={logout}
              >
                Disconnect
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </>
      )}
    </div>
  );
};

export default ConnectWallet;
