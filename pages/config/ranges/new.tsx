import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { IRangesMargins } from "..";

interface ITemplateToRender {
  name: string;
  template: IRangesMargins[];
}

const NewRanges: React.FC = () => {
  const router = useRouter();
  const [config, setConfig] = useState<ITemplateToRender>({
    name: "",
    template: [],
  });
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: `/configs`,
    method: "post",
    body: {
      name: config?.name,
      category: "ranges",
      template: JSON.stringify(config?.template),
    },
    onSuccess: () => router.push(`/config`),
  });

  const getId = (arr: IRangesMargins[]) => {
    const l = arr.length;
    return l ? arr[l - 1].id + 1 : 1;
  };

  const setRange = (newRange: string, colIdx: number) => {
    setConfig((prev) => {
      const draft = { ...prev };
      draft.template[colIdx].range = newRange;
      return draft;
    });
  };

  const setMargin = (newMargin: number, colIdx: number) => {
    setConfig((prev) => {
      const draft = { ...prev };
      draft.template[colIdx].margin = newMargin;
      return draft;
    });
  };

  const addOfferColumn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newConfig = { ...config };

    newConfig.template.push({
      id: getId(newConfig.template),
      range: "NEW!!!",
      margin: 0,
    });
    setConfig(newConfig);
  };

  const removeOfferColumn = (colIdx: number) => {
    const newConfig = { ...config };
    newConfig.template.splice(colIdx, 1);
    setConfig(newConfig);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    router.push(`/config`);
  };

  const renderMainHeader = () => (
    <thead>
      <tr>
        {renderSubHeader()}
        <th
          style={{
            width: "60px",
            textAlign: "center" as const,
          }}
        >
          <button
            //@ts-ignore
            onClick={addOfferColumn}
            className="button is-link is-inverted is-rounded  mx-1 p-3"
          >
            <i className="fas fa-plus"></i>
          </button>
        </th>
      </tr>
    </thead>
  );
  const renderSubHeader = () =>
    config.template.map(({ range, margin, id }, idx) => (
      <Fragment key={id}>
        <th className="pt-1 has-text-centered" style={{ borderLeft: 0 }}>
          <input
            style={{ borderLeft: 0 }}
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
        <th
          className="pt-1 has-text-centered"
          style={{ borderRight: "3px solid #e2e2e2" }}
        >
          <input
            style={{ borderRight: 0 }}
            className="input is-small m-0 p-0 has-text-centered has-text-weight-bold"
            defaultValue={margin}
            onChange={(e) => setMargin(parseFloat(e.target.value), idx)}
          />
          <p className="is-size-7 mt-1 mb-2">%</p>
        </th>
      </Fragment>
    ));

  return (
    <div className="full-page full-page--top">
      <div className="card max-w-900 m-3 big-shadow">
        <div className="card-content">
          <form onSubmit={onSubmit}>
            <h1 style={{ fontSize: "34px" }} className="title m-3 mb-5 is-4">
              <i className="fas fa-edit mr-1"></i> New Set of Ranges
            </h1>
            <div className="is-flex is-flex-direction-column">
              <div className="field m-3">
                <label className="label">Name</label>
                <input
                  className={inputStyle("name")}
                  type="text"
                  value={config.name}
                  required
                  autoFocus
                  onChange={(e) =>
                    setConfig({ ...config, name: e.target.value })
                  }
                />
              </div>
              <div className="field m-3">
                <table>{renderMainHeader()}</table>
              </div>
            </div>

            {errorsJSX()}
            <div className="m-3 mt-6 ">
              <NiceButton>
                <i className="far fa-save"></i>
                <span className="m-1"></span> Save Ranges
              </NiceButton>
              <span className="m-3"></span>
              <NiceButton color="cancel" onClick={onCancel}>
                Cancel
              </NiceButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRanges;
