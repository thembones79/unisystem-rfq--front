import React, { useState } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/useRequest";
import { UserPicker } from "../../components/user-picker";
import { NiceButton } from "../../components/nice-button";
import { Toggle } from "../../components/toggle";
import { Loader } from "../../components/loader";
import { DataList } from "../../components/data-list";
import { sizeOptions } from "../../utils/datalists-options";
import { IUser } from "../users";
import { IRfq } from "./";

interface NewRfqProps {
  currentUser: IUser;
}

const NewRfq = ({ currentUser }: NewRfqProps) => {
  const [eau, setEau] = useState(0);
  const [forValuation, setForValuation] = useState(false);
  const [projectClientId, setProjectClientId] = useState(0);
  const [samplesExpected, setSamplesExpected] = useState("");
  const [mpExpected, setMpExpected] = useState("");
  const [name, setName] = useState("");
  const [reqDispTech, setReqDispTech] = useState("");
  const [reqDispSize, setReqDispSize] = useState("");
  const [reqDispRes, setReqDispRes] = useState("");
  const [reqDispBrigt, setReqDispBrigt] = useState("");
  const [reqDispAngle, setReqDispAngle] = useState("");
  const [reqDispOd, setReqDispOd] = useState("");
  const [reqDispAa, setReqDispAa] = useState("");
  const [reqDispInter, setReqDispInter] = useState("");
  const [reqDispOt, setReqDispOt] = useState("");
  const [reqDispSt, setReqDispSt] = useState("");
  const [reqDispSpec, setReqDispSpec] = useState("");
  const [reqTpSize, setReqTpSize] = useState("");
  const [reqTpAa, setReqTpAa] = useState("");
  const [reqTpTech, setReqTpTech] = useState("");
  const [reqTpOt, setReqTpOt] = useState("");
  const [reqTpInter, setReqTpInter] = useState("");
  const [reqTpGlass, setReqTpGlass] = useState("");
  const [reqTp, setReqTp] = useState("");
  const [reqOthers, setReqOthers] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { doRequest, errorsJSX, inputStyle } = useRequest({
    url: "/rfqs",
    method: "post",
    body: {
      eau,
      for_valuation: forValuation,
      project_client_id: projectClientId,
      samples_expected: samplesExpected,
      mp_expected: mpExpected,
      name: name,
      req_disp_tech: reqDispTech,
      req_disp_size: reqDispSize,
      req_disp_res: reqDispRes,
      req_disp_brigt: reqDispBrigt,
      req_disp_angle: reqDispAngle,
      req_disp_od: reqDispOd,
      req_disp_aa: reqDispAa,
      req_disp_inter: reqDispInter,
      req_disp_ot: reqDispOt,
      req_disp_st: reqDispSt,
      req_disp_spec: reqDispSpec,
      req_tp_size: reqTpSize,
      req_tp_aa: reqTpAa,
      req_tp_tech: reqTpTech,
      req_tp_od: reqTpOt,
      req_tp_inter: reqTpInter,
      req_tp_glass: reqTpGlass,
      req_tp_spec: reqTp,
      req_others: reqOthers,
    },
    onSuccess: (rfq: IRfq) => onSuccess(rfq),
  });

  const onSuccess = (rfq: IRfq) => {
    Router.push(`/rfqs/${rfq.id}`);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    Router.push("/rfqs");
  };

  if (!currentUser) {
    return <div></div>;
  }

  const renderContent = () => (
    <form onSubmit={onSubmit}>
      <h1 className="title m-3 mb-5">🎯 New RFQ</h1>

      <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
        <div className="field m-3">
          <label className="label">Name</label>
          <input
            className={inputStyle("extra_note")}
            type="text"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <UserPicker
          handleChange={setProjectClientId}
          label="Customer"
          fieldname="projectClientId"
          fetch="/clients"
        />

        <div className="field m-3">
          <label className="label">EAU</label>
          <input
            className={inputStyle("eau")}
            name="eau"
            type="number"
            required
            value={eau}
            onChange={(e) => setEau(parseInt(e.target.value))}
          />
        </div>

        <div className="field m-3">
          <label className="label">Samples Expected</label>
          <input
            className={inputStyle("samples_expected")}
            type="text"
            value={samplesExpected}
            onChange={(e) => setSamplesExpected(e.target.value)}
          />
        </div>

        <div className="field m-3">
          <label className="label">MP Expected</label>
          <input
            className={inputStyle("mp_expected")}
            type="text"
            value={mpExpected}
            onChange={(e) => setMpExpected(e.target.value)}
          />
        </div>

        <Toggle
          handleChange={setForValuation}
          label="For Valuation"
          fieldname="for_valuation"
          initialValue={forValuation}
        />
      </div>

      <article className=" m-3">
        <div className="panel-block">Display</div>

        <div className="panel-block is-flex-wrap-wrap">
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />

          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
        </div>
      </article>

      <article className=" m-3">
        <div className="panel-block">Touch</div>

        <div className="panel-block is-flex-wrap-wrap">
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />

          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
        </div>
      </article>

      <article className=" m-3">
        <div className="panel-block">Others</div>

        <div className="panel-block is-flex-wrap-wrap">
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size"
            fieldname="reqDispSize"
          />
        </div>
      </article>

      <div className="m-3 mt-6 ">
        <NiceButton>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> Add RFQ
        </NiceButton>
        <span className="m-3"></span>
        <NiceButton color="cancel" onClick={(event) => onCancel(event)}>
          Cancel
        </NiceButton>
      </div>
    </form>
  );

  const renderLoader = () => (
    <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <p className="title is-4 mb-6 mt-3">Please Wait...</p>
      <p className="subtitle">Signing into ClickUp...</p>
      <Loader />
    </div>
  );

  return (
    <div className="full-page">
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

export default NewRfq;
