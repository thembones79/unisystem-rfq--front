import { GetStaticPaths } from "next";
import React, { useEffect, useState } from "react";
import { IUser } from "../users";
export interface ICol<T> {
  name: keyof T;
  label: string;
  margin: number;
}

export interface IOffer {
  id: number;
  Partnumber: string;
  Description: string;
  SAMPLE: string;
  "2 - 10": string;
  "11 - 100": string;
  Shipment: string;
}

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

const Offers: React.FC<OffersProps> = ({ currentUser }) => {
  const renderHeader = () =>
    columns.map(({ label }) => (
      <>
        {["2 - 10", "11 - 100", "SAMPLE"].includes(label) ? (
          <>
            <th style={{ textAlign: "center" }} key={label + 1} colSpan={2}>
              {label}
            </th>
          </>
        ) : (
          <th style={getStyle(label)} rowSpan={2} key={label + 2}>
            {label}
          </th>
        )}
      </>
    ));
  const renderHeader2 = () =>
    columns.map(({ label }) => (
      <>
        {["2 - 10", "11 - 100", "SAMPLE"].includes(label) ? (
          <>
            <th key={label + 11} colSpan={2}>
              base
            </th>
            <th key={label + 81}>end</th>
          </>
        ) : (
          <th style={getStyle(label)} key={label + 21}>
            &nbsp;
          </th>
        )}
      </>
    ));
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

  const renderBody = () =>
    rows.map((row) => <tr key={row.id}>{renderColumns(row)}</tr>);

  const renderContent = () => (
    <>
      <div className="card-content">
        <div className="mb-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
          <div className="is-flex is-flex-wrap-wrap">
            <h1 className="title my-3 is-4">New Offer</h1>
            <span className="m-3 "></span>
          </div>
        </div>

        <table className="table is-striped is-narrow is-hoverable is-fullwidth is-bordered is-size-7">
          <thead>
            <tr>{renderHeader()}</tr>
          </thead>
          <tbody className="fixed200 ">{renderBody()}</tbody>
        </table>
      </div>
    </>
  );

  return <div className="card ">{renderContent()}</div>;
};

export async function getStaticProps(context: any) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default Offers;
