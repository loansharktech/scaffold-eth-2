import type { FunctionComponent } from "react";
import { useState } from "react";
import BorrowApyColumn from "./table/BorrowApyColumn";
import BorrowBalanceColumn from "./table/BorrowBalanceColumn";
import CollateralColumn from "./table/CollateralColumn";
import SupplyApyColumn from "./table/SupplyApyColumn";
import SupplyBalanceColumn from "./table/SupplyBalanceColumn";
import TokenColumn from "./table/TokenColumn";
import TotalSupplyColumn from "./table/TotalSupplyColumn";
import WalletBalanceColumn from "./table/WalletBalanceColumn";
import { Table } from "@mantine/core";
import TokenManagerDialog from "~~/components/realm/TokenManagerDialog";
import type { Market, Realm } from "~~/hooks/useRealm";
import { useToken } from "~~/hooks/useToken";
import { p18 } from "~~/utils/amount";

const TokenItem: FunctionComponent<{
  realm: Realm;
  market: Market;
  onClick: any;
}> = ({ market, onClick, realm }) => {
  const marketData = realm[market.address];
  const token = realm.config!.tokens!.find(token => {
    return token.name === market.token;
  })!;
  const tokenInfo = useToken(realm, market);
  const price = marketData?.price?.toFixed(2);

  const walletBalanceAmount = tokenInfo.balance?.div(p18);
  const walletBalancePrice = walletBalanceAmount?.multipliedBy(marketData?.price || 0);

  const supplyAmount = marketData?.totalSupply?.div(p18).multipliedBy(marketData.exchangeRate || 0);
  const supplyPrice = supplyAmount?.multipliedBy(marketData?.price || 0);

  const supplyBalanceAmount = marketData?.balance?.div(p18).multipliedBy(marketData.exchangeRate || 0);
  const supplyBalancePrice = supplyBalanceAmount?.multipliedBy(marketData?.price || 0);

  const supplyAPY = marketData?.tokenSupplyAPY?.multipliedBy(100).toNumber() || 0;

  const borrowAmount = marketData?.borrowBalanceStored?.div(p18);
  const borrowPrice = borrowAmount?.multipliedBy(marketData?.price || 0);
  const borrowAPY = marketData?.tokenBorrowAPY?.multipliedBy(100).toNumber() || 0;

  return (
    <tr className="transition-all action hover:bg-[#CFE7FC]" onClick={onClick}>
      <td>
        <TokenColumn token={token} price={price}></TokenColumn>
      </td>
      <td>
        <CollateralColumn realm={realm} market={market} borrowAmount={borrowAmount}></CollateralColumn>
      </td>
      <td>
        <WalletBalanceColumn
          token={token}
          amount={walletBalanceAmount}
          price={walletBalancePrice}
        ></WalletBalanceColumn>
      </td>
      <td>
        <TotalSupplyColumn token={token} amount={supplyAmount} price={supplyPrice}></TotalSupplyColumn>
      </td>
      <td>
        <SupplyBalanceColumn
          token={token}
          amount={supplyBalanceAmount}
          price={supplyBalancePrice}
        ></SupplyBalanceColumn>
      </td>
      <td>
        <SupplyApyColumn value={supplyAPY}></SupplyApyColumn>
      </td>
      <td>
        <BorrowBalanceColumn token={token} amount={borrowAmount} price={borrowPrice}></BorrowBalanceColumn>
      </td>
      <td>
        <BorrowApyColumn value={borrowAPY}></BorrowApyColumn>
      </td>
    </tr>
  );
};

const TokenList: FunctionComponent<{
  className: string;
  realm: Realm;
}> = ({ className, realm }) => {
  const [opened, setOpened] = useState(false);
  const [market, setMarket] = useState<Market | null>(null);
  const markets = realm.markets || [];
  return (
    <div className={`bg-white/80 border border-[#E3F2FF] rounded-lg ${className} overflow-x-scroll scrollbar-hide`}>
      <Table horizontalSpacing="xl">
        <thead>
          <tr>
            <th className="columns-2 ">Token</th>
            <th>Collateral</th>
            <th>Wallet Balance</th>
            <th>Total Supply</th>
            <th>Supply Balance</th>
            <th>Supply APY</th>
            <th>Borrow Balance</th>
            <th>Borrow APY</th>
          </tr>
        </thead>
        <tbody>
          {realm.markets?.map(market => {
            return (
              <TokenItem
                key={market.address}
                realm={realm}
                market={market}
                onClick={() => {
                  setMarket(market);
                  setOpened(true);
                }}
              ></TokenItem>
            );
          })}
        </tbody>
      </Table>
      <TokenManagerDialog
        opened={opened}
        setOpened={setOpened}
        realm={realm}
        market={market}
        // @ts-ignore
        onChangeMarket={address => {
          setMarket(
            markets.find(m => {
              return m.address === address;
            })!,
          );
        }}
      ></TokenManagerDialog>
    </div>
  );
};

export default TokenList;
