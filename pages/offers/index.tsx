import { GetStaticPaths } from "next";
import React, { useEffect, useState } from "react";
import { IUser } from "../users";
export interface ICol<T> {
  name: keyof T;
  label: string;
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
  { name: "Partnumber", label: "Partnumber" },
  { name: "Description", label: "Description" },
  { name: "SAMPLE", label: "SAMPLE" },
  { name: "2 - 10", label: "2 - 10" },
  { name: "11 - 100", label: "11 - 100" },
  { name: "Shipment", label: "Shipment" },
];

const rows: IOffer[] = [
  {
    id: 1,
    Partnumber: "WF0096ATYAA3DNN0#",
    Description: `LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
    SAMPLE: "55",
    "2 - 10": "50",
    "11 - 100": "40",
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
      return { width: "170px" };
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
            <th key={label}>{label}</th>
            <th key={label}></th>
          </>
        ) : (
          <th style={getStyle(label)} key={label}>
            {label}
          </th>
        )}
      </>
    ));

  const renderColumns = (row: IOffer) =>
    columns.map(({ name }) => (
      <>
        <td style={getStyle(name)} className="pl-3" key={name}>
          {row[name]}
        </td>
        {["2 - 10", "11 - 100", "SAMPLE"].includes(name) ? (
          <td className="pl-3" key={name}>
            {row[name]}
          </td>
        ) : null}
      </>
    ));

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

        <table className="table is-striped is-narrow is-hoverable is-fullwidth is-size-7">
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
