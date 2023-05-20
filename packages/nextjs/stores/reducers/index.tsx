import trade, { actions as tradeActions } from "./trade";
import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
  trade,
});

export const actions = {
  trade: tradeActions,
};
