import React, { useEffect, useState, Fragment } from "react";
import { GetStaticPaths } from "next";
import Router, { useRouter } from "next/router";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import PdfDownloader from "../../components/pdf-downloader";
import { Loader } from "../../components/loader";
import { IUser } from "../users";

export interface IProduct {
  id: number;
  partnumber: string;
  description: string;
}

export interface ICol<T> {
  name: keyof T;
  label: string;
  margin: number;
}

export interface ITemplate {
  id: number;
  name: string;
  category: "buffers" | "disclaimers" | "ranges";
  template: IRangesMargins[] | { pl: string; en: string };
}
export interface IOfferFromApi {
  id: number;
  number: string;
  ranges_margins: string;
  for_buffer: boolean;
  rfq_id: number;
  kam_fullname: string;
  rfq: string;
  pick_from_buffer: string;
  project_client_id: number;
  department: string;
  client: string;
  footer_pl: string;
  footer_en: string;
  buffer_pl: string;
  buffer_en: string;
  contents: string;
}

export interface IOffer {
  id: number;
  number: string;
  dateAdded: string;
  dateUpdated: string;
  rangesMargins: IRangesMargins[];
  forBuffer: boolean;
  rfqId: number;
  rfq: string;
  kamFullname: string;
  pickFromBuffer: string;
  projectClientId: number;
  department: string;
  client: string;
  footerPl: string;
  footerEn: string;
  bufferPl: string;
  bufferEn: string;
  contents: IContents[];
}

export interface IRangesMargins {
  id: number;
  range: string;
  margin: number;
}

export interface IContents {
  id: number;
  partnumber: string;
  currency: CurrencyType;
  description: string;
  shipment: string;
  prices: IPrices[];
}

export interface IPrices {
  id: number;
  basePrice: number;
  clientPrice: number;
}

export type CurrencyType = "PLN" | "USD" | "EUR";

const INIT_OFFER: IOffer = {
  id: 0,
  rfqId: 0,
  number: "",
  kamFullname: "",
  rfq: "",
  dateAdded: "",
  dateUpdated: "",
  rangesMargins: [
    {
      id: 0,
      range: "SAMPLE",
      margin: 0,
    },
  ],
  forBuffer: false,
  pickFromBuffer: "",
  projectClientId: 0,
  department: "",
  client: "",
  footerPl: "",
  footerEn: "",
  bufferPl: "Odebrac przed ###.",
  bufferEn: "Pick up before ###.",
  contents: [],
};

export const currencies: CurrencyType[] = ["PLN", "USD", "EUR"];

export interface OffersProps {
  currentUser: IUser;
}

export const getStyle = (label: string) => {
  switch (label) {
    case "description":
      return { width: "380px" };

    case "partnumber":
      return { width: "160px" };

    case "shipment":
      return { width: "80px" };

    case "currency":
      return { width: "80px" };

    default:
      return {};
  }
};

const ShowOffer: React.FC<OffersProps> = ({ currentUser }) => {
  // PdfMakeWrapper.setFonts(pdfFonts);
  // const pdf = new PdfMakeWrapper();
  const router = useRouter();
  const { offerId } = router.query;
  const [offer, setOffer] = useState<IOffer>(INIT_OFFER);
  const [isLoading, setIsLoading] = useState(false);

  const { doRequest, inputStyle, errorsJSX } = useRequest({
    url: `/offers/${offerId}`,
    method: "get",
    onSuccess: (data: IOfferFromApi) => {
      setIsLoading(false);
      //@ts-ignore
      setOffer({
        number: data.number,
        rfqId: data.rfq_id,
        rfq: data.rfq,
        department: data.department,
        client: data.client,
        rangesMargins: JSON.parse(data.ranges_margins),
        forBuffer: data.for_buffer,
        kamFullname: data.kam_fullname,
        pickFromBuffer: data.pick_from_buffer,
        projectClientId: data.project_client_id,
        footerPl: data.footer_pl,
        footerEn: data.footer_en,
        bufferPl: data.buffer_pl,
        bufferEn: data.buffer_en,
        contents: JSON.parse(data.contents) as IContents[],
      });
    },
  });

  const {
    rangesMargins,
    forBuffer,
    pickFromBuffer,
    footerEn,
    client,
    kamFullname,
    department,
    footerPl,
    number,
    rfqId,
    rfq,
    bufferEn,
    bufferPl,
    contents,
  } = offer;

  useEffect(() => {
    doRequest();
  }, []);

  const renderMainHeader = () => (
    <thead>
      <tr>
        <th style={getStyle("partnumber")}>Partnumber</th>
        <th style={getStyle("description")}>Description</th>
        <th className="has-text-centered" style={getStyle("currency")}>
          Currency
        </th>
        {renderSubHeader()}
        <th className="has-text-centered" style={getStyle("shipment")}>
          Shipment
        </th>
      </tr>
    </thead>
  );

  const renderRfqLink = () => {
    if (rfqId > 1) {
      return (
        <button
          className={`button is-success is-light m-4`}
          onClick={() => Router.push(`/rfqs/${rfqId}`)}
        >
          <span className="m-2 ">go to RFQ: </span> <b>{rfq}</b>
        </button>
      );
    }
  };

  const renderSubHeader = () =>
    rangesMargins.map(({ range, margin, id }, idx) => (
      <Fragment key={id}>
        <th className="pt-1 has-text-centered" style={{ borderRightWidth: 0 }}>
          {range}
        </th>
      </Fragment>
    ));

  const renderTableColumns = (ranges: IPrices[], rowIdx: number) =>
    ranges.map((range, colIdx) => (
      <td
        key={range.id}
        className="has-text-centered px-2"
        style={{ borderLeftWidth: 0 }}
      >
        {range.clientPrice + ""}
      </td>
    ));

  const renderTable = () =>
    contents.map((row, rowIdx) => (
      <tr key={row.id}>
        <td style={getStyle("partnumber")}>{row.partnumber}</td>
        <td style={getStyle("description")}>{row.description}</td>
        <td className="has-text-centered" style={getStyle("currency")}>
          {row.currency}
        </td>
        {renderTableColumns(row.prices, rowIdx)}
        <td className="has-text-centered" style={getStyle("shipment")}>
          {row.shipment}
        </td>
      </tr>
    ));

  const renderContent = () => (
    <>
      <div className="mb-3 is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between is-flex-wrap-wrap">
        <div className="is-flex is-flex-wrap-wrap">
          <h1 className="title my-3 is-4">{number}</h1>
          <span className="m-3 "></span>
        </div>
        {renderRfqLink()}

        <div className="my-3 ">
          <span className="m-3 mr-6"></span>
          <NiceButton onClick={() => Router.push(`/offers/edit/${offerId}`)}>
            <i className="fas fa-edit"></i>
          </NiceButton>
          <span className="m-3"></span>
          <NiceButton
            color="danger"
            onClick={() => Router.push(`/offers/delete/${offerId}`)}
          >
            <i className="fas fa-trash-alt"></i>
          </NiceButton>
        </div>
      </div>

      <div className="is-flex is-flex-direction-row is-justify-content-space-between is-flex-wrap-wrap">
        <div className="field m-3">
          <label className="label">Client</label>
          <div>{client}</div>
        </div>

        {forBuffer && (
          <div className="field m-3">
            <label className="label">Buffer</label>
            <div>{pickFromBuffer}</div>
          </div>
        )}

        <div className="field m-3">
          <label className="label">Key Account Manager</label>
          <div>{kamFullname}</div>
        </div>

        <div className="field m-3">
          <label className="label">Department</label>
          <div>{department}</div>
        </div>
      </div>

      <table className="table is-striped is-narrow is-hoverable is-fullwidth is-bordered is-size-7 m-3">
        {renderMainHeader()}
        <tbody className="fixed200 ">{renderTable()}</tbody>
      </table>
      <article className=" m-3">
        <label className="label is-small mb-0 mt-6">Warunki:</label>
        <div className="panel-block"></div>
        {forBuffer && bufferPl.replace("###", pickFromBuffer)}
        {footerPl?.split("\n")?.map((x) => (
          <div key={x}>{x}</div>
        ))}
        <label className="label is-small mb-0 mt-6">Disclaimer:</label>
        <div className="panel-block"></div>
        {forBuffer && bufferEn.replace("###", pickFromBuffer)}
        {footerEn?.split("\n")?.map((x) => (
          <div key={x}>{x}</div>
        ))}
      </article>

      <div className="m-3 mt-6 ">
        <PdfDownloader offer={offer} language="pl" />
        <span className="m-3"></span>
        <PdfDownloader offer={offer} language="en" />
      </div>
    </>
  );

  const renderLoader = () => (
    <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-400">
      <p className="title is-4 mb-6 mt-3">Please Wait...</p>
      <p className="subtitle">One moment, please...</p>
      <Loader />
    </div>
  );

  return (
    <div className="full-page full-page--top">
      <div className="card  m-3 big-shadow">
        <div className="card-content">
          {isLoading ? renderLoader() : renderContent()}
          {errorsJSX()}
        </div>
      </div>
    </div>
  );
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

export default ShowOffer;
