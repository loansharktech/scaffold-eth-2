import { useCallback, useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useDisconnect, useNetwork, useAccount as userWeb3Account } from "wagmi";

export function useAccount() {
  const { isConnected, address } = userWeb3Account();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    setLogin(isConnected);
  }, [isConnected]);

  const login = useCallback(async () => {
    if (!isLogin && openConnectModal) {
      openConnectModal();
    }
  }, [isLogin, openConnectModal]);

  return {
    login,
    logout: disconnect as any,
    isLogin,
    address,
    chain,
  };
}
