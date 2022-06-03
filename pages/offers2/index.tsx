// import { GetStaticPaths } from "next";
import React, { useEffect, useState } from "react";
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
  range: string;
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
          range: "SAMPLE",
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
            range: "SAMPLE",
            basePrice: 100,
            clientPrice: 155,
          },
          {
            range: "2 - 10",
            basePrice: 90,
            clientPrice: 135,
          },
          {
            range: "11 - 100",
            basePrice: NaN,
            clientPrice: 112,
          },
        ],
      },
      {
        id: 2,
        Partnumber: "2WF0096ATYAA3DNN0#",
        currency: "PLN",
        Description: `2LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
        Shipment: "2020-08-08",
        ranges2: [
          {
            range: "SAMPLE",
            basePrice: 100,
            clientPrice: 155,
          },
          {
            range: "2 - 10",
            basePrice: 90,
            clientPrice: 135,
          },
          {
            range: "11 - 100",
            basePrice: 80,
            clientPrice: 112,
          },
        ],
      },
    ],
  },
];

//const offersString = JSON.stringify(offers);

const currencies: CurrencyType[] = ["PLN", "USD", "EUR"];
/*
const columns: ICol<IOffer>[] = [
  { name: "Partnumber", label: "Partnumber", margin: 0 },
  { name: "Description", label: "Description", margin: 0 },
  { name: "SAMPLE", label: "SAMPLE", margin: 55 },
  { name: "2 - 10", label: "2 - 10", margin: 50 },
  { name: "11 - 100", label: "11 - 100", margin: 40 },
  { name: "Shipment", label: "Shipment", margin: 0 },
];

const rows: IOffer[] = [
  {
    id: 1,
    Partnumber: "WF0096ATYAA3DNN0#",
    Description: `LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
    SAMPLE: "100",
    "2 - 10": "90",
    "11 - 100": "80",
    Shipment: "2020-08-08",
  },
  {
    id: 2,
    Partnumber: "WEO001602BLPP3N00000#",
    Description: `OLED COG, 16x2, Yellow, Contr:WS0012, Int:8b, 3.3V, AA:30.69x5.94, OL:53.0x20.0x7.6, 80 cd/m2`,
    SAMPLE: "200",
    "2 - 10": "190",
    "11 - 100": "180",
    Shipment: "2020-08-08",
  },
  {
    id: 3,
    Partnumber: "RVT7.0A800480LNWN00",

    Description: `LCD TFT 7.00", 800x480, LED XXcd/m^2, LVDS, AA: 154.08x85.92, OL: 164.8x99.8x5.5, FFC50pin x 0.5mm`,
    SAMPLE: "300",
    "2 - 10": "280",
    "11 - 100": "220",
    Shipment: "2020-08-08",
  },
];
*/
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
    offer.rangesB.map((key) => (
      <th style={{ textAlign: "center" }} key={"key" + key.range} colSpan={2}>
        {key.range}
      </th>
    ));
  /*
  const renderColumns = (row: IOffer) =>
    columns.map(({ name, margin }) =>
      ["2 - 10", "11 - 100", "SAMPLE"].includes(name) ? (
        <>
          <td className="pl-3" key={name + 3}>
            <input
              style={{ textAlign: "center" }}
              className="input is-small"
              name={name.toString()}
              defaultValue={row[name]}
            />
          </td>
          <td className="pl-3" style={{ textAlign: "center" }} key={name + 4}>
            {
              //@ts-ignore
              (parseFloat(row[name]) * (margin + 100)) / 100
            }
          </td>
        </>
      ) : (
        <td style={getStyle(name)} className="pl-3" key={name + 4}>
          {row[name]}
        </td>
      )
    );
    */
  //  const renderBody = () =>
  //    rows.map((row) => <tr key={row.id}>{renderColumns(row)}</tr>);

  const renderTableColumns = (ranges: Ranges2Entity[], rowIdx: number) =>
    ranges.map((range, colIdx) => (
      <>
        <td className="pl-3" key={range.range + "a"}>
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
        <td
          className="pl-3"
          style={{ textAlign: "center" }}
          key={range.range + "b"}
        >
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
            (range.basePrice * (offer.rangesB[colIdx].margin + 100)) / 100
          )}
        </td>
      </>
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

// export async function getStaticProps(context: any) {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

// export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
//   return {
//     paths: [], //indicates that no page needs be created at build time
//     fallback: "blocking", //indicates the type of fallback
//   };
// };

export default Offers2;
