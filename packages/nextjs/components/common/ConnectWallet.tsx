import type { FC } from "react";
import { useAccountModal } from "@rainbow-me/rainbowkit";
import { useSwitchNetwork } from "wagmi";
import { useAccount } from "~~/hooks/useAccount";
import { useAddNetwork } from "~~/hooks/useAddNetwork";
import { trimAddr } from "~~/utils/format";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const ConnectWallet: FC = () => {
  const { isLogin, login, address, chain } = useAccount();

  const targetNetwork = getTargetNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { openAccountModal } = useAccountModal();
  const { addNetworkToMetamask } = useAddNetwork();

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
          {/* {!invalidNetwork && (
            <div className="flex items-center py-1 px-3 border border-[#C6DFEC] rounded-lg action">
              <Image src="/logo-s.png" width={35} height={35} alt="logo"></Image>
              <span className="font-medium ml-2 text-gray-400">{balance?.toFixed(2)}</span>
            </div>
          )} */}

          {invalidNetwork ? (
            <div
              className="py-[10px] px-5 rounded-lg bg-red-500 text-white action"
              onClick={() => {
                try {
                  switchNetwork?.(targetNetwork.id);
                  addNetworkToMetamask();
                } catch (e) {}
              }}
            >
              WRONG NETWORK
            </div>
          ) : (
            <div className="py-[10px] px-5 rounded-lg bg-bg_dark text-white action" onClick={openAccountModal}>
              {trimAddr(address as string, 4, 4)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectWallet;
