import React, { useEffect, useState, Fragment } from "react";
import { IUser } from "../users";
export interface ICol<T> {
  name: keyof T;
  label: string;
  margin: number;
}

export interface IOffer {
  id: number;
  number: string;
  dateAdded: string;
  dateUpdated: string;
  rangesB: RangesBEntity[];
  forBuffer: boolean;
  pickFromBuffer: string;
  projectClientId: number;
  kamId: number;
  department: string;
  footerId: number;
  contents: ContentsEntity[];
}

export interface RangesBEntity {
  range: string;
  margin: number;
}

export interface ContentsEntity {
  partnumber: string;
  currency: CurrencyType;
  description: string;
  shipment: string;
  ranges2: Ranges2Entity[];
}

export interface Ranges2Entity {
  basePrice: number;
  clientPrice: number;
}

export type CurrencyType = "PLN" | "USD" | "EUR";

const INIT_OFFER: IOffer = {
  id: 0,
  number: "",
  dateAdded: "",
  dateUpdated: "",
  rangesB: [
    {
      range: "SAMPLE",
      margin: 0,
    },
  ],
  forBuffer: false,
  pickFromBuffer: "",
  projectClientId: 0,
  kamId: 0,
  department: "",
  footerId: 0,
  contents: [
    {
      partnumber: "#",
      description: ``,
      currency: "PLN",
      shipment: "",
      ranges2: [
        {
          basePrice: 0,
          clientPrice: 0,
        },
      ],
    },
  ],
};

const offers: IOffer[] = [
  {
    id: 1,
    number: "2022/05/123",
    dateAdded: "2022.05.22",
    dateUpdated: "2022.05.23",
    rangesB: [
      {
        range: "SAMPLE",
        margin: 55,
      },
      {
        range: "2 - 10",
        margin: 50,
      },
      {
        range: "11 - 100",
        margin: 40,
      },
    ],
    forBuffer: false,
    pickFromBuffer: "2022 Q4",
    projectClientId: 2,
    kamId: 7,
    department: "PL",
    footerId: 3,
    contents: [
      {
        partnumber: "WF0096ATYAA3DNN0#",
        currency: "PLN",
        description: `LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
        shipment: "2020-08-08",
        ranges2: [
          {
            basePrice: 100,
            clientPrice: 155,
          },
          {
            basePrice: 90,
            clientPrice: 135,
          },
          {
            basePrice: NaN,
            clientPrice: 112,
          },
        ],
      },
      {
        partnumber: "2WF0096ATYAA3DNN0#",
        currency: "EUR",
        description: `2LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
        shipment: "2020-08-08",
        ranges2: [
          {
            basePrice: 200,
            clientPrice: 155,
          },
          {
            basePrice: NaN,
            clientPrice: 135,
          },
          {
            basePrice: 50,
            clientPrice: 112,
          },
        ],
      },
    ],
  },
];

const currencies: CurrencyType[] = ["PLN", "USD", "EUR"];

interface OffersProps {
  currentUser: IUser;
}

const getStyle = (label: string) => {
  switch (label) {
    case "description":
      return { width: "380px" };

    case "partnumber":
      return { width: "160px" };

    case "shipment":
      return { width: "80px" };

    case "currency":
      return { width: "80px" };

    // case "endCol":
    //   return { width: "70px", textAlign: "center"  };

    default:
      return {};
  }
};

const style = {
  endCol: { width: "60px", textAlign: "center" as const },
  currency: { width: "80px" },
};

const Offers2: React.FC<OffersProps> = ({ currentUser }) => {
  const [offer, setOffer] = useState<IOffer>(INIT_OFFER);
  console.log(currentUser);

  const setCurrency = (newCurrency: CurrencyType, rowIdx: number) =>
    setOffer((prev) => {
      const draft = { ...prev };
      draft.contents[rowIdx].currency = newCurrency;
      return draft;
    });

  const setRange = (newRange: string, colIdx: number) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.rangesB[colIdx].range = newRange;
      return draft;
    });
  };

  const setMargin = (newMargin: number, colIdx: number) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.rangesB[colIdx].margin = newMargin;
      return draft;
    });
  };

  const setOfferBasePrice = (
    newBasePrice: number,
    rowIdx: number,
    colIdx: number
  ) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.contents[rowIdx].ranges2[colIdx].basePrice = newBasePrice;
      return draft;
    });
    setOfferClientPrice(
      Math.round(newBasePrice * (offer.rangesB[colIdx].margin + 100)) / 100,
      rowIdx,
      colIdx
    );
  };

  const setOfferClientPrice = (
    newClientPrice: number,
    rowIdx: number,
    colIdx: number
  ) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.contents[rowIdx].ranges2[colIdx].clientPrice = newClientPrice;
      return draft;
    });
  };

  const addOfferRow = () => {
    setOffer((prev) => {
      const draft = { ...prev };
      const ranges2 = draft.rangesB.map((tier) => {
        return {
          basePrice: 0,
          clientPrice: 0,
        };
      });
      const newRow = {
        partnumber: "",
        currency: "PLN" as CurrencyType,
        description: "",
        shipment: "",
        ranges2,
      };
      draft.contents.push(newRow);
      return draft;
    });
  };

  const addOfferColumn = () => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.rangesB.push({
        range: "NEW!!!",
        margin: 0,
      });
      draft.contents.forEach((element) => {
        element.ranges2.push({
          basePrice: 0,
          clientPrice: 0,
        });
      });
      return draft;
    });
  };

  const removeOfferRow = (rowIdx: number) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.contents.splice(rowIdx, 1);
      return draft;
    });
  };

  const removeOfferColumn = (colIdx: number) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.rangesB.splice(colIdx, 1);
      draft.contents.forEach((element) => {
        element.ranges2.splice(colIdx, 1);
      });
      return draft;
    });
  };

  const showOffer = () => console.log(offer);

  const getOffer = () => setOffer(offers[0]);

  const saveOffer = () => console.log({ endpoint: "/api/offers", body: offer });

  useEffect(getOffer, []);

  const renderCurrencySelect = (currency: CurrencyType, rowIdx: number) => (
    <div className={`select`}>
      <select
        name="currency"
        id="currency"
        value={currency}
        required
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const chosenCurrency = e.target.value as CurrencyType;
          if (currencies.includes(chosenCurrency)) {
            setCurrency(chosenCurrency, rowIdx);
          }
        }}
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );

  const renderMainHeader = () => (
    <thead>
      <tr>
        <th style={getStyle("partnumber")}>Partnumber</th>
        <th style={getStyle("description")}>Description</th>
        <th style={getStyle("shipment")}>Shipment</th>
        <th style={getStyle("currency")}>Currency</th>
        {renderSubHeader()}
        <th style={style.endCol}>
          <button
            onClick={addOfferColumn}
            className="button is-link is-inverted is-rounded is-small mx-1 p-3"
          >
            <i className="fas fa-plus"></i>
          </button>
        </th>
      </tr>
    </thead>
  );

  const renderSubHeader = () =>
    offer.rangesB.map(({ range, margin }, idx) => (
      <Fragment key={idx + range + margin}>
        <th className="pt-1 has-text-centered" style={{ borderRightWidth: 0 }}>
          <input
            style={{ border: 0 }}
            className="input is-small m-0 p-0 has-text-centered has-text-weight-bold"
            defaultValue={range}
            onChange={(e) => setRange(e.target.value, idx)}
          />
          <button
            onClick={() => {
              removeOfferColumn(idx);
            }}
            className="button is-danger is-inverted  is-rounded is-small mx-1 p-3"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </th>
        <th className="pt-1 has-text-centered" style={{ borderLeftWidth: 0 }}>
          <input
            style={{ border: 0 }}
            className="input is-small m-0 p-0 has-text-centered has-text-weight-bold"
            defaultValue={margin}
            onChange={(e) => setMargin(parseFloat(e.target.value), idx)}
          />
          <p className="is-size-7 mt-1 mb-2">%</p>
        </th>
      </Fragment>
    ));

  const renderTableColumns = (ranges: Ranges2Entity[], rowIdx: number) =>
    ranges.map((range, colIdx) => (
      <Fragment key={colIdx + range.basePrice + range.clientPrice}>
        <td className="px-2" style={{ borderRightWidth: 0 }}>
          <input
            className="input is-small has-text-centered"
            type="number"
            defaultValue={range.basePrice + ""}
            onChange={(e) =>
              setOfferBasePrice(parseFloat(e.target.value), rowIdx, colIdx)
            }
          />
        </td>
        <td className="has-text-centered px-2" style={{ borderLeftWidth: 0 }}>
          {isNaN(range.basePrice) ? (
            <input
              className="input is-small has-text-centered"
              type="number"
              defaultValue={range.clientPrice + ""}
              onChange={(e) =>
                setOfferClientPrice(parseFloat(e.target.value), rowIdx, colIdx)
              }
            />
          ) : (
            Math.round(range.basePrice * (offer.rangesB[colIdx].margin + 100)) /
            100
          )}
        </td>
      </Fragment>
    ));

  const renderTable = () =>
    offer.contents.map((row, rowIdx) => (
      <tr key={rowIdx + JSON.stringify(row)}>
        <td style={getStyle("partnumber")}>{row.partnumber}</td>
        <td style={getStyle("description")}>{row.description}</td>
        <td style={getStyle("shipment")}>{row.shipment}</td>
        <td style={getStyle("currency")}>
          {renderCurrencySelect(row.currency, rowIdx)}
        </td>
        {renderTableColumns(row.ranges2, rowIdx)}
        <td style={style.endCol}>
          <button
            onClick={() => {
              removeOfferRow(rowIdx);
            }}
            className="button is-danger is-inverted  is-rounded is-small mx-1 p-3"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    ));

  const renderContent = () => (
    <>
      <div className="card-content">
        <div className="mb-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
          <div className="is-flex is-flex-wrap-wrap">
            <h1 className="title my-3 is-4">New Offer</h1>
            <span className="m-3 ">
              <button className="button" onClick={saveOffer}>
                Save
              </button>
            </span>
          </div>
        </div>
        <div></div>
        <button className="button" onClick={showOffer}>
          Show offer
        </button>

        <table className="table is-striped is-narrow is-hoverable is-fullwidth is-bordered is-size-7">
          {renderMainHeader()}
          <tbody className="fixed200 ">
            {renderTable()}
            <tr>
              <td>
                <button
                  onClick={addOfferRow}
                  className="button is-link is-inverted is-rounded is-small mx-1 p-3"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  return <div className="card ">{renderContent()}</div>;
};

export default Offers2;
