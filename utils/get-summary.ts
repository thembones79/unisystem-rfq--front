import { IContents } from "../pages/offers/[offerId]";

export const getSummary = (contents: IContents[]) => {
  //@ts-ignore
  const currencies = [...new Set(contents.map(({ currency }) => currency))];

  const summary3 = currencies.map((c) => {
    const filteredByCurrency = contents.filter(
      ({ currency }) => c === currency
    );

    const singleRow = filteredByCurrency
      .map(({ prices }) => prices)
      .map((item) => item.map(({ clientPrice }) => clientPrice));

    const result = singleRow.reduce(function (r, a) {
      a.forEach(function (b, i) {
        r[i] = (r[i] || 0) + b;
      });
      return r;
    }, []);

    return {
      currency: c,
      totals: result,
    };
  });

  return summary3;
};
