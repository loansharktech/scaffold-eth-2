export const trimAddr = (addr: string, start = 3, end = 3) => addr?.substring(0, start) + "..." + addr?.slice(-end);

export function numberWithCommas(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
