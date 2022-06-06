import React, { useEffect, useState, Fragment } from "react";
import { IUser } from "../users";
export interface ICol<T> {
  name: keyof T;
  label: string;
  margin: number;
}

export interface IOffer2 {
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
  id: number;
  Partnumber: string;
  currency: CurrencyType;
  Description: string;
  Shipment: string;
  ranges2: Ranges2Entity[];
}

export interface Ranges2Entity {
  basePrice: number;
  clientPrice: number;
}

export type CurrencyType = "PLN" | "USD" | "EUR";

const INIT_OFFER: IOffer2 = {
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
      id: 1,
      Partnumber: "#",
      Description: ``,
      currency: "PLN",
      Shipment: "",
      ranges2: [
        {
          basePrice: 0,
          clientPrice: 0,
        },
      ],
    },
  ],
};

const offers: IOffer2[] = [
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
        id: 1,
        Partnumber: "WF0096ATYAA3DNN0#",
        currency: "PLN",
        Description: `LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
        Shipment: "2020-08-08",
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
        id: 2,
        Partnumber: "2WF0096ATYAA3DNN0#",
        currency: "EUR",
        Description: `2LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
        Shipment: "2020-08-08",
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
            basePrice: 80,
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
    case "Description":
      return { width: "500px" };

    case "Partnumber":
      return { width: "190px" };

    case "Shipment":
      return { width: "100px" };

    default:
      return {};
  }
};

const Offers2: React.FC<OffersProps> = ({ currentUser }) => {
  const [offer, setOffer] = useState<IOffer2>(INIT_OFFER);
  console.log(currentUser);

  const setCurrency = (currency: CurrencyType) =>
    setOffer((prev) => {
      return { ...prev, currency };
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
      (newBasePrice * (offer.rangesB[colIdx].margin + 100)) / 100,
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

  const showOffer = () => console.log(offer);

  const getOffer = () => setOffer(offers[0]);

  const saveOffer = () => console.log({ endpoint: "/api/offers", body: offer });

  useEffect(getOffer, []);

  const renderCurrencySelect = () => (
    <div className={`select`}>
      <select
        name="currency"
        id="currency"
        value={offer.contents[0].currency}
        required
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const chosenCurrency = e.target.value as CurrencyType;
          if (currencies.includes(chosenCurrency)) {
            setCurrency(chosenCurrency);
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
        <th style={getStyle("Partnumber")}>Partnumber</th>
        <th style={getStyle("Description")}>Description</th>
        {renderSubHeader()}
        <th style={getStyle("Shipment")}>Shipment</th>
      </tr>
    </thead>
  );

  const renderSubHeader = () =>
    offer.rangesB.map((key, idx) => (
      <Fragment key={"key" + key.range}>
        <th style={{ textAlign: "center", border: 0 }}>
          <input
            style={{ textAlign: "center", fontWeight: 700 }}
            className="input is-small m-0 p-0"
            defaultValue={key.range}
            onChange={(e) => setRange(e.target.value, idx)}
          />
        </th>
        <th style={{ textAlign: "center" }}>
          <input
            style={{ textAlign: "center", fontWeight: 700 }}
            className="input is-small m-0 p-0"
            defaultValue={key.margin}
            onChange={(e) => setMargin(parseFloat(e.target.value), idx)}
          />
        </th>
      </Fragment>
    ));

  const renderTableColumns = (ranges: Ranges2Entity[], rowIdx: number) =>
    ranges.map((range, colIdx) => (
      <Fragment key={range.basePrice + "a"}>
        <td className="pl-3">
          <input
            style={{ textAlign: "center" }}
            className="input is-small"
            type="number"
            defaultValue={range.basePrice + ""}
            onChange={(e) =>
              setOfferBasePrice(parseFloat(e.target.value), rowIdx, colIdx)
            }
          />
        </td>
        <td className="pl-3" style={{ textAlign: "center" }}>
          {isNaN(range.basePrice) ? (
            <input
              style={{ textAlign: "center" }}
              className="input is-small"
              type="number"
              defaultValue={range.clientPrice + ""}
              onChange={(e) =>
                setOfferClientPrice(parseFloat(e.target.value), rowIdx, colIdx)
              }
            />
          ) : (
            (range.clientPrice * (offer.rangesB[colIdx].margin + 100)) / 100
          )}
        </td>
      </Fragment>
    ));

  const renderTable = () =>
    offer.contents.map((row, rowIdx) => (
      <tr key={row.id}>
        <td style={getStyle("Partnumber")}>{row.Partnumber}</td>
        <td style={getStyle("Description")}>{row.Description}</td>
        {renderTableColumns(row.ranges2, rowIdx)}
        <td style={getStyle("Shipment")}>{row.Shipment}</td>
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
        <div className={`select`}>
          <select
            name="currency"
            id="currency"
            value={offer.contents[0].currency}
            required
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const chosenCurrency = e.target.value as CurrencyType;
              if (currencies.includes(chosenCurrency)) {
                setCurrency(chosenCurrency);
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
        <div></div>
        <button className="button" onClick={showOffer}>
          Show offer
        </button>

        <table className="table is-striped is-narrow is-hoverable is-fullwidth is-bordered is-size-7">
          {renderMainHeader()}
          <tbody className="fixed200 ">{renderTable()}</tbody>
        </table>
      </div>
    </>
  );

  return <div className="card ">{renderContent()}</div>;
};

export default Offers2;
