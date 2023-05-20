import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export enum TradeStep {
  ENTER_AMOUNT,
  APPROVE,
  EXECUTE,
}

export enum TradeType {
  Supply = "supply",
  Borrow = "borrow",
  Withdraw = "withdraw",
  Repay = "repay",
}

type TradeData = {
  amount?: number;
  stepIndex: TradeStep;
  approving: boolean;
  approveTx?: string;
  approveError?: string;
  executing: boolean;
  executeTx?: string;
  executeError?: string;
};

const slice = createSlice({
  name: "trade",
  initialState: {
    supply: {
      amount: undefined,
      stepIndex: TradeStep.ENTER_AMOUNT,
      approving: false,
      executing: false,
    },
    borrow: {
      amount: undefined,
      stepIndex: TradeStep.ENTER_AMOUNT,
      approving: false,
      executing: false,
    },
    withdraw: {
      amount: undefined,
      stepIndex: TradeStep.ENTER_AMOUNT,
      approving: false,
      executing: false,
    },
    repay: {
      amount: undefined,
      stepIndex: TradeStep.ENTER_AMOUNT,
      approving: false,
      executing: false,
    },
    tradeType: TradeType.Supply,
  } as {
    supply: TradeData;
    borrow: TradeData;
    withdraw: TradeData;
    repay: TradeData;
    tradeType: TradeType;
  },
  reducers: {
    updateSupply(state, action: PayloadAction<Partial<TradeData>>) {
      state.supply = {
        ...state.supply,
        ...action.payload,
      };
    },
    updateBorrow(state, action: PayloadAction<Partial<TradeData>>) {
      state.borrow = {
        ...state.supply,
        ...action.payload,
      };
    },
    updateWithdraw(state, action: PayloadAction<Partial<TradeData>>) {
      state.withdraw = {
        ...state.supply,
        ...action.payload,
      };
    },
    updateRepay(state, action: PayloadAction<Partial<TradeData>>) {
      state.repay = {
        ...state.supply,
        ...action.payload,
      };
    },
    changeTradeType(state, action: PayloadAction<TradeType>) {
      state.tradeType = action.payload;
    },
  },
});

export const actions = {
  ...slice.actions,
};

export default slice.reducer;
