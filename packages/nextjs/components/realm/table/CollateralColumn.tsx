import type { FunctionComponent } from "react";
import { Loader, Switch } from "@mantine/core";
import { useCollateral } from "~~/hooks/useCollateral";
import type { Market, Realm } from "~~/hooks/useRealm";

const CollateralColumn: FunctionComponent<{
  realm: Realm;
  market: Market;
}> = ({ realm, market }) => {
  const { isMember, enterMarkets, exitMarket, loading } = useCollateral(realm, market);
  return (
    <div
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <Switch
        classNames={{
          track: "cursor-pointer",
        }}
        size="md"
        checked={isMember}
        disabled={loading}
        thumbIcon={loading && <Loader size="sm"></Loader>}
        onChange={e => {
          if (e.currentTarget.checked) {
            enterMarkets();
          } else {
            exitMarket();
          }
        }}
      ></Switch>
    </div>
  );
};

export default CollateralColumn;
