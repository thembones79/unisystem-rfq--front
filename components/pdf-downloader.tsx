import React from "react";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { headerFooter } from "./header-footer";
import { IOffer, IPrices } from "../pages/offers/[offerId]";
import { NiceButton } from "./nice-button";
// import { PdfMakeWrapper } from "pdfmake-wrapper";
// import * as pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake

export interface PdfDownloaderProps {
  offer: IOffer;
  language: "pl" | "en";
}
const PdfDownloader: React.FC<PdfDownloaderProps> = ({ offer, language }) => {
  const {
    number,
    dateUpdated,
    rangesMargins,
    forBuffer,
    pickFromBuffer,
    client,
    footerPl,
    footerEn,
    bufferPl,
    bufferEn,
    contents,
  } = offer;

  const subheader = rangesMargins.map(({ range }) => range);

  const tableHeader = [
    "Partnumber",
    "Description",
    "Currency",
    ...subheader,
    "Shipment",
  ];

  const subcolumns = (prices: IPrices[]) =>
    prices.map(({ clientPrice }) => clientPrice);

  const tableRows = contents.map(
    ({ partnumber, description, currency, prices, shipment }) => [
      partnumber,
      description,
      currency,
      ...subcolumns(prices),
      shipment,
    ]
  );

  // @ts-ignore
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const dd: any = {
    pageMargins: [40, 100, 40, 100],
    header: {
      image: headerFooter,
      width: 597,
    },
    content: [
      {
        text: `${language === "pl" ? "Oferta" : "Offer"} ${number}`,
        style: "header",
        margin: [0, 40, 0, 40],
        alignment: "center",
      },

      {
        columns: [
          {
            text: "Client",
            alignment: "left",
            style: "subheader",
          },
          {
            text: "Data",
            alignment: "right",
            style: "subheader",
          },
        ],
      },

      {
        columns: [
          {
            text: client,
            alignment: "left",
            margin: [0, 10, 0, 40],
          },
          {
            text: new Date().toISOString().substring(0, 10),
            alignment: "right",
            margin: [0, 10, 0, 40],
          },
        ],
      },
      {
        layout: "lightHorizontalLines", // optional
        style: "small",
        table: {
          headerRows: 1,
          // widths: ["*", "auto", 100, "*"],

          body: [tableHeader, ...tableRows],
          style: ["small"],
        },
      },

      { text: "Warunki", style: "disclaimer" },
      {
        ol: [bufferPl.replace("###", pickFromBuffer), ...footerPl.split("\n")],
        style: ["small"],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
      disclaimer: {
        fontSize: 8,
        bold: true,
        margin: [0, 20, 0, 10],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
  };
  return (
    <NiceButton
      onClick={() => {
        pdfMake
          .createPdf(dd)
          .download(
            `${number.replaceAll("/", "")}${language[0].toUpperCase()}.pdf`
          );
      }}
    >
      <i className="fas fa-download"></i>
      <span className="m-1"></span>
      {language === "pl" ? "Pobierz PDF" : "Download PDF"}
      <span className="ml-2" style={{ fontWeight: 900 }}>
        {language.toLocaleUpperCase()}
      </span>
    </NiceButton>
  );
};

export default PdfDownloader;
