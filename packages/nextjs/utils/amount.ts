import BigNumber from "bignumber.js";

export const B = new BigNumber(10).pow(9);
export const M = new BigNumber(10).pow(6);
export const K = new BigNumber(10).pow(3);

export const p18 = new BigNumber(10).pow(18);
export const p16 = new BigNumber(10).pow(16);

export function amountDecimal(amount?: BigNumber) {
  if (!amount || amount.eq(0)) {
    return 2;
  }
  return amount.lt(1) ? 4 : 2;
}

export const amountDesc = (amount?: BigNumber, decimal?: number) => {
  if (!amount) {
    return (0).toFixed(decimal);
  }
  let rtn;
  if (amount.gte(B)) {
    rtn = amount.div(B).toFormat(decimal) + "B";
  } else if (amount.gte(M)) {
    rtn = amount.div(M).toFormat(decimal) + "M";
  } else if (amount.gte(K)) {
    rtn = amount.div(K).toFormat(decimal) + "K";
  } else {
    rtn = amount.toFormat(decimal);
  }
  if (rtn === "-0.00") {
    rtn = "0.00";
  }
  return rtn;
};
