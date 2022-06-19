import React, { useEffect, useState, Fragment } from "react";
import Router, { useRouter } from "next/router";
import { useRequest } from "../../../hooks/useRequest";
import { NiceButton } from "../../../components/nice-button";
import { UserPicker } from "../../../components/user-picker";
import { Toggle } from "../../../components/toggle";
import { Loader } from "../../../components/loader";
import { IUser } from "../../users";

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
  category: string;
  template: string;
}

export interface IOffer {
  id: number;
  number: string;
  dateAdded: string;
  dateUpdated: string;
  rangesMargins: IRangesMargins[];
  forBuffer: boolean;
  rfqId: number;
  pickFromBuffer: string;
  projectClientId: number;
  department: string;
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
  footerPl: "",
  footerEn: "",
  bufferPl: "",
  bufferEn: "",
  contents: [
    {
      id: 0,
      partnumber: "#",
      description: ``,
      currency: "PLN",
      shipment: "",
      prices: [
        {
          id: 0,
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
    rfqId: 1,
    number: "2022/05/123",
    dateAdded: "2022.05.22",
    dateUpdated: "2022.05.23",
    rangesMargins: [
      {
        id: 1,
        range: "SAMPLE",
        margin: 55,
      },
      {
        id: 2,
        range: "2 - 10",
        margin: 50,
      },
      {
        id: 3,
        range: "11 - 100",
        margin: 40,
      },
    ],
    forBuffer: false,
    pickFromBuffer: "2022 Q4",
    projectClientId: 2,
    department: "PL",
    footerPl: `aaaaa\nbbbbb\n\nccccc\n`,
    footerEn: `ddddd\neeeee\n\nfffff\n`,
    bufferPl: `Prosze odebrac do ###.`,
    bufferEn: `You have to pick it up till ###.`,
    contents: [
      {
        id: 1,
        partnumber: "WF0096ATYAA3DNN0#",
        currency: "PLN",
        description: `LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
        shipment: "2020-08-08",
        prices: [
          {
            id: 1,
            basePrice: 100,
            clientPrice: 155,
          },
          {
            id: 2,
            basePrice: 90,
            clientPrice: 135,
          },
          {
            id: 3,
            basePrice: NaN,
            clientPrice: 112,
          },
        ],
      },
      {
        id: 2,
        partnumber: "2WF0096ATYAA3DNN0#",
        currency: "EUR",
        description: `2LCD TFT 9.6" 80x160, SPI, LED White, 500cd/m^2 , R.G.B., AA: 10.80x21.696, OL: 279.95x12.4x15, ZIF 13pin, 0,8mm`,
        shipment: "2020-08-08",
        prices: [
          {
            id: 1,
            basePrice: 200,
            clientPrice: 155,
          },
          {
            id: 2,
            basePrice: NaN,
            clientPrice: 135,
          },
          {
            id: 3,
            basePrice: 50,
            clientPrice: 112,
          },
        ],
      },
    ],
  },
];

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

export const style = {
  endCol: { width: "60px", textAlign: "center" as const },
  currency: { width: "80px" },
};

const NewOffer: React.FC<OffersProps> = ({ currentUser }) => {
  const router = useRouter();
  const rfqId = router.query.rfqId || 1;

  const [offer, setOffer] = useState<IOffer>(INIT_OFFER);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [heightPl, setHeightPl] = useState(36);
  const [heightEn, setHeightEn] = useState(36);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<ITemplate[]>([]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
  };

  const setCurrency = (newCurrency: CurrencyType, rowIdx: number) =>
    setOffer((prev) => {
      const draft = { ...prev };
      draft.contents[rowIdx].currency = newCurrency;
      return draft;
    });

  const setBufferPl = (newBufferPl: string) => {
    const { pickFromBuffer, bufferPl } = offer;

    const bufferToSet = newBufferPl.includes(pickFromBuffer)
      ? newBufferPl.replace(pickFromBuffer, "###")
      : bufferPl;

    const newOffer = {
      ...offer,
      bufferPl: bufferToSet,
    };
    setOffer(newOffer);
  };

  const setFooterPl = (newFooterPl: string) => {
    const newOffer = { ...offer, footerPl: newFooterPl };
    setOffer(newOffer);
  };

  const setProjectClientId = (newProjectClientId: number) => {
    const newOffer = { ...offer, projectClientId: newProjectClientId };
    setOffer(newOffer);
  };

  const setForBuffer = () => {
    const newOffer = { ...offer, forBuffer: !offer.forBuffer };
    setOffer(newOffer);
  };

  const setPickFromBuffer = (newPickFromBuffer: string) => {
    const newOffer = { ...offer, pickFromBuffer: newPickFromBuffer };
    setOffer(newOffer);
  };

  const setBufferEn = (newBufferEn: string) => {
    const { pickFromBuffer, bufferEn } = offer;

    const bufferToSet = newBufferEn.includes(pickFromBuffer)
      ? newBufferEn.replace(pickFromBuffer, "###")
      : bufferEn;

    const newOffer = {
      ...offer,
      bufferEn: bufferToSet,
    };
    setOffer(newOffer);
  };

  const setFooterEn = (newFooterEn: string) => {
    const newOffer = { ...offer, footerEn: newFooterEn };
    setOffer(newOffer);
  };

  const setPartnumber = (newPn: string, rowIdx: number) =>
    setOffer((prev) => {
      const draft = { ...prev };
      draft.contents[rowIdx].partnumber = newPn;
      return draft;
    });

  const setDescription = (newDescription: string, rowIdx: number) =>
    setOffer((prev) => {
      const draft = { ...prev };
      draft.contents[rowIdx].description = newDescription;
      return draft;
    });

  const setShipment = (newShipment: string, rowIdx: number) => {
    const newOffer = { ...offer };
    newOffer.contents[rowIdx].shipment = newShipment;
    setOffer(newOffer);
  };

  const setRange = (newRange: string, colIdx: number) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.rangesMargins[colIdx].range = newRange;
      return draft;
    });
  };

  const setMargin = (newMargin: number, colIdx: number) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.rangesMargins[colIdx].margin = newMargin;
      return draft;
    });
  };

  const setRangesMargins = (newRangesMargins: IRangesMargins[]) => {
    const newOffer = { ...offer };
    newOffer.rangesMargins = newRangesMargins;
    setOffer(newOffer);
  };

  const setOfferBasePrice = (
    newBasePrice: number,
    rowIdx: number,
    colIdx: number
  ) => {
    setOffer((prev) => {
      const draft = { ...prev };
      draft.contents[rowIdx].prices[colIdx].basePrice = newBasePrice;
      return draft;
    });
    setOfferClientPrice(
      Math.round(newBasePrice * (offer.rangesMargins[colIdx].margin + 100)) /
        100,
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
      draft.contents[rowIdx].prices[colIdx].clientPrice = newClientPrice;
      return draft;
    });
  };

  const getId = (arr: IContents[] | IRangesMargins[] | IPrices[]) => {
    const l = arr.length;
    return l ? arr[l - 1].id + 1 : 1;
  };

  const getDescription = (pn: string) => {
    return products.filter(({ partnumber }) => partnumber === pn)[0]
      ?.description;
  };

  const addOfferRow = () => {
    setOffer((prev) => {
      const draft = { ...prev };
      const prices = draft.rangesMargins.map((tier) => {
        return {
          id: tier.id,
          basePrice: 0,
          clientPrice: 0,
        };
      });
      const newRow = {
        id: getId(draft.contents),
        partnumber: "",
        currency: "PLN" as CurrencyType,
        description: "",
        shipment: "",
        prices,
      };

      return { ...draft, contents: [...draft.contents, newRow] };
    });
  };

  const addOfferColumn = () => {
    const newOffer = { ...offer };

    newOffer.rangesMargins.push({
      id: getId(newOffer.rangesMargins),
      range: "NEW!!!",
      margin: 0,
    });
    newOffer.contents.forEach((element) => {
      element.prices.push({
        id: getId(element.prices),
        basePrice: 0,
        clientPrice: 0,
      });
    });
    setOffer(newOffer);
  };

  const removeOfferRow = (rowIdx: number) => {
    const newOffer = { ...offer };
    newOffer.contents.splice(rowIdx, 1);
    setOffer(newOffer);
  };

  const removeOfferColumn = (colIdx: number) => {
    const newOffer = { ...offer };
    newOffer.rangesMargins.splice(colIdx, 1);
    newOffer.contents.forEach((element) => {
      element.prices.splice(colIdx, 1);
    });
    setOffer(newOffer);
  };

  const showOffer = () => console.log(products);

  const getOffer = () => {
    setOffer(offers[0]);

    setHeightPl(24 * offers[0].footerPl.split("\n").length + 12);
    setHeightEn(24 * offers[0].footerEn.split("\n").length + 12);
  };

  const saveOffer = () => console.log(offer);

  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/offers`,
    method: "post",
    onSuccess: (offer: IOffer) => onSuccess(offer),
  });

  const onSuccess = (offer: IOffer) => {
    Router.push(`/offers/${offer.id}`);
  };

  const getProducts = useRequest({
    url: "/erpxlproducts",
    method: "get",
    onSuccess: (products: IProduct[]) => setProducts(products),
  });

  const getTemplates = useRequest({
    url: "/configs",
    method: "get",
    onSuccess: (templates: ITemplate[]) => {
      setTemplates(templates);
    },
  });

  useEffect(() => {
    getProducts.doRequest();
    getOffer();
  }, []);

  const renderPartnumberOptions = () => {
    return products.map(({ partnumber }) => (
      <option key={partnumber}>{partnumber}</option>
    ));
  };

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
    offer.rangesMargins.map(({ range, margin, id }, idx) => (
      <Fragment key={id}>
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

  const renderTableColumns = (ranges: IPrices[], rowIdx: number) =>
    ranges.map((range, colIdx) => (
      <Fragment key={range.id}>
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
            Math.round(
              range.basePrice * (offer.rangesMargins[colIdx].margin + 100)
            ) / 100
          )}
        </td>
      </Fragment>
    ));

  const renderTable = () =>
    offer.contents.map((row, rowIdx) => (
      <tr key={row.id}>
        <td style={getStyle("partnumber")}>
          <input
            className="input is-small pl-1"
            list={"pn" + 60}
            required
            type="text"
            value={row.partnumber}
            onChange={(e) => {
              const pn = e.target.value.toUpperCase();
              setPartnumber(pn, rowIdx);
              setDescription(getDescription(pn), rowIdx);
            }}
          />
        </td>
        <td style={getStyle("description")}>
          <textarea
            className="textarea is-small pl-1"
            rows={2}
            required
            value={row.description}
            onChange={(e) => setDescription(e.target.value, rowIdx)}
          />
        </td>
        <td style={getStyle("shipment")}>
          <input
            className="input is-small pl-1"
            required
            type="text"
            value={row.shipment}
            onChange={(e) => setShipment(e.target.value, rowIdx)}
          />
        </td>
        <td style={getStyle("currency")}>
          {renderCurrencySelect(row.currency, rowIdx)}
        </td>
        {renderTableColumns(row.prices, rowIdx)}
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
    <form onSubmit={onSubmit}>
      <h1 className="title m-3 mb-5">✨ New Offer</h1>

      <datalist id={"pn" + 60}>{renderPartnumberOptions()}</datalist>

      <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
        <UserPicker
          handleChange={setProjectClientId}
          label="Customer"
          fieldname="projectClientId"
          fetch="/clients"
        />

        <Toggle
          handleChange={setForBuffer}
          label="For Buffer"
          fieldname="for_buffer"
          initialValue={offer.forBuffer}
        />
        {offer.forBuffer && (
          <div className="field m-3">
            <label className="label">When to pick up</label>
            <input
              className={inputStyle("for_buffer")}
              value={offer.pickFromBuffer}
              onChange={(e) => setPickFromBuffer(e.target.value)}
              type="text"
            />
          </div>
        )}

        <table className="table is-striped is-narrow is-hoverable is-fullwidth is-bordered is-size-7 m-3">
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
      <article className=" m-1">
        <div className="panel-block"></div>
        {offer.forBuffer && (
          <div className="field m-2">
            <label className="label is-small">Buffer Notification PL</label>
            <textarea
              className="input"
              value={offer.bufferPl.replace("###", offer.pickFromBuffer)}
              onChange={(e) => {
                setBufferPl(e.target.value);
              }}
            />
          </div>
        )}
        <div className="field m-2">
          <label className="label is-small">Disclaimer PL</label>
          <textarea
            className="input"
            value={offer.footerPl}
            style={{ height: `${heightPl}px` }}
            onChange={(e) => {
              setHeightPl(24 * e.target.value.split("\n").length + 12);
              setFooterPl(e.target.value);
            }}
          />
        </div>
        <div className="panel-block"></div>
        {offer.forBuffer && (
          <div className="field m-2">
            <label className="label is-small">Buffer Notification EN</label>
            <textarea
              className="input"
              value={offer.bufferEn.replace("###", offer.pickFromBuffer)}
              onChange={(e) => {
                setBufferEn(e.target.value);
              }}
            />
          </div>
        )}
        <div className="field m-2 mt-4">
          <label className="label is-small">Disclaimer EN</label>
          <textarea
            className="input"
            value={offer.footerEn}
            style={{ height: `${heightEn}px` }}
            onChange={(e) => {
              setHeightEn(24 * e.target.value.split("\n").length + 12);
              setFooterEn(e.target.value);
            }}
          />
        </div>
      </article>

      <div className="m-3 mt-6 ">
        <NiceButton>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> Add Offer
        </NiceButton>
        <span className="m-3"></span>
        <NiceButton color="cancel" onClick={showOffer}>
          Cancel
        </NiceButton>
      </div>
    </form>
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

export default NewOffer;
