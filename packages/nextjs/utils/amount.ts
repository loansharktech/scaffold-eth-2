import BigNumber from "bignumber.js";

export const M = new BigNumber(10).pow(6);
export const K = new BigNumber(10).pow(3);

export const p18 = new BigNumber(10).pow(18);
export const p16 = new BigNumber(10).pow(16);

export const amountDesc = (amount?: BigNumber, decimal?: number) => {
  if (!amount) {
    return (0).toFixed(decimal);
  }
  if (amount.gt(M)) {
    return amount.div(M).toFormat(decimal) + "M";
  } else if (amount.gt(K)) {
    return amount.div(K).toFormat(decimal) + "K";
  } else {
    return amount.toFormat(decimal);
  }
};
