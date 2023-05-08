import type { FunctionComponent } from "react";
import { useState } from "react";
import BorrowApyColumn from "./table/BorrowApyColumn";
import BorrowBalanceColumn from "./table/BorrowBalanceColumn";
import SupplyApyColumn from "./table/SupplyApyColumn";
import SupplyBalanceColumn from "./table/SupplyBalanceColumn";
import TokenColumn from "./table/TokenColumn";
import TotalSupplyColumn from "./table/TotalSupplyColumn";
import WalletBalanceColumn from "./table/WalletBalanceColumn";
import { Table } from "@mantine/core";
import TokenManagerDialog from "~~/components/realm/TokenManagerDialog";
import { Token, tokens } from "~~/configs/pool";
import type { Realm } from "~~/configs/pool";

const TokenList: FunctionComponent<{
  className: string;
  realm: Realm;
}> = ({ className }) => {
  const [opened, setOpened] = useState(false);
  const [token, setToken] = useState<Token | null>(null);
  const rows = tokens.map((token, index) => (
    <tr
      key={index}
      className="transition-all action hover:bg-[#CFE7FC]"
      onClick={() => {
        setToken(token);
        setOpened(true);
      }}
    >
      <td>
        <TokenColumn token={token}></TokenColumn>
      </td>
      <td>
        <WalletBalanceColumn></WalletBalanceColumn>
      </td>
      <td>
        <TotalSupplyColumn token={token}></TotalSupplyColumn>
      </td>
      <td>
        <SupplyBalanceColumn></SupplyBalanceColumn>
      </td>
      <td>
        <SupplyApyColumn></SupplyApyColumn>
      </td>
      <td>
        <BorrowBalanceColumn></BorrowBalanceColumn>
      </td>
      <td>
        <BorrowApyColumn></BorrowApyColumn>
      </td>
    </tr>
  ));
  return (
    <div className={`bg-white/80 border border-[#E3F2FF] rounded-lg ${className} overflow-x-scroll`}>
      <Table horizontalSpacing="xl">
        <thead>
          <tr>
            <th className="columns-2 ">Token</th>
            <th>Wallet Balance</th>
            <th>Total Supply</th>
            <th>Supply Balance</th>
            <th>Supply APY</th>
            <th>Borrow Balance</th>
            <th>Borrow APY</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <TokenManagerDialog
        opened={opened}
        setOpened={setOpened}
        token={token}
        onChangeToken={setToken}
      ></TokenManagerDialog>
    </div>
  );
};

export default TokenList;
