import type { FunctionComponent } from "react";
import { Loader, Switch, Tooltip } from "@mantine/core";
import BigNumber from "bignumber.js";
import { useCollateral } from "~~/hooks/useCollateral";
import type { Market, Realm } from "~~/hooks/useRealm";

const CollateralColumn: FunctionComponent<{
  realm: Realm;
  market: Market;
  borrowAmount?: BigNumber;
}> = ({ realm, market, borrowAmount }) => {
  const { isMember, enterMarkets, exitMarket, loading } = useCollateral(realm, market);
  const disabled = isMember && borrowAmount?.gt(0);

  return (
    <Tooltip
      disabled={!disabled}
      multiline
      width={250}
      label={`You need to repay your borrowed ${market.token} to stop using as collateral.`}
    >
      <div
        className="flex justify-center"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Switch
          classNames={{
            track: `${disabled ? "cursor-not-allowed" : "cursor-pointer"}`,
          }}
          size="md"
          checked={isMember}
          disabled={loading}
          thumbIcon={loading && <Loader size={17}></Loader>}
          onChange={e => {
            if (disabled) {
              return;
            }
            if (e.currentTarget.checked) {
              enterMarkets();
            } else {
              exitMarket();
            }
          }}
        ></Switch>
      </div>
    </Tooltip>
  );
};

export default CollateralColumn;
