import React, { useState } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/useRequest";
import { UserPicker } from "../../components/user-picker";
import { NiceButton } from "../../components/nice-button";
import { Toggle } from "../../components/toggle";
import { Loader } from "../../components/loader";
import { DataList } from "../../components/data-list";
import {
  sizeOptions,
  dispTechOptions,
  resolutionOptions,
  anglesOptions,
  dispInterfaceOptions,
  tpInterfaceOptions,
  tpTechOptions,
  tpSizeOptions,
} from "../../utils/datalists-options";
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
  const [reqTpOd, setReqTpOd] = useState("");
  const [reqTpInter, setReqTpInter] = useState("");
  const [reqTpGlass, setReqTpGlass] = useState("");
  const [reqTpSpec, setReqTpSpec] = useState("");
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
      req_tp_od: reqTpOd,
      req_tp_inter: reqTpInter,
      req_tp_glass: reqTpGlass,
      req_tp_spec: reqTpSpec,
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
            required
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
          <label className="label">Number of Samples</label>
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
            options={dispTechOptions}
            value={reqDispTech}
            className={inputStyle("req_disp_tech")}
            onChange={setReqDispTech}
            label="Technology"
            fieldname="setReqDispTech"
          />
          <DataList
            options={sizeOptions}
            value={reqDispSize}
            className={inputStyle("req_disp_size")}
            onChange={setReqDispSize}
            label="Size (inches)"
            fieldname="reqDispSize"
          />
          <DataList
            options={resolutionOptions}
            value={reqDispRes}
            className={inputStyle("req_disp_res")}
            onChange={setReqDispRes}
            label="Resolution"
            fieldname="reqDispRes"
          />
          <DataList
            options={[]}
            value={reqDispBrigt}
            className={inputStyle("req_disp_brigt")}
            onChange={setReqDispBrigt}
            label="Brightness (cd/m2)"
            fieldname="setReqDispBrigt"
          />
          <DataList
            options={anglesOptions}
            value={reqDispAngle}
            className={inputStyle("req_disp_angle")}
            onChange={setReqDispAngle}
            label="Angle"
            fieldname="reqDispAngle"
          />
          <DataList
            options={dispInterfaceOptions}
            value={reqDispInter}
            className={inputStyle("req_disp_inter")}
            onChange={setReqDispInter}
            label="Interface"
            fieldname="reqDispInter"
          />
          <DataList
            options={[]}
            value={reqDispAa}
            className={inputStyle("req_disp_aa")}
            onChange={setReqDispAa}
            label="Active Area (mm)"
            fieldname="reqDispAa"
          />
          <DataList
            options={[]}
            value={reqDispOd}
            className={inputStyle("req_disp_od")}
            onChange={setReqDispOd}
            label="Outline Dimensions (mm)"
            fieldname="reqDispOd"
          />
          <DataList
            options={[]}
            value={reqDispOt}
            className={inputStyle("req_disp_ot")}
            onChange={setReqDispOt}
            label="Oper. Temp. (℃)"
            fieldname="reqDispOt"
          />
          <DataList
            options={[]}
            value={reqDispSt}
            className={inputStyle("req_disp_st")}
            onChange={setReqDispSt}
            label="Stor. Temp. (℃)"
            fieldname="reqDispSt"
          />
          <div className="field m-3">
            <label className="label is-small">
              Special requirements (if any)
            </label>
            <textarea
              className="input is-400"
              name="req_disp_spec"
              value={reqDispSpec}
              onChange={(e) => setReqDispSpec(e.target.value)}
            />
          </div>
        </div>
      </article>

      <article className=" m-3">
        <div className="panel-block">Touch</div>

        <div className="panel-block is-flex-wrap-wrap">
          <DataList
            options={tpTechOptions}
            value={reqTpTech}
            className={inputStyle("req_tp_tech")}
            onChange={setReqTpTech}
            label="Technology"
            fieldname="reqTpTech"
          />
          <DataList
            options={tpSizeOptions}
            value={reqTpSize}
            className={inputStyle("req_tp_size")}
            onChange={setReqTpSize}
            label="Size (inches)"
            fieldname="reqTpSize"
          />
          <DataList
            options={tpInterfaceOptions}
            value={reqTpInter}
            className={inputStyle("req_to_inter")}
            onChange={setReqTpInter}
            label="Interface"
            fieldname="reqTpInter"
          />
          <DataList
            options={[]}
            value={reqTpGlass}
            className={inputStyle("req_tp_glass")}
            onChange={setReqTpGlass}
            label="Cover glass thickness"
            fieldname="reqTpGlass"
          />
          <DataList
            options={[]}
            value={reqTpAa}
            className={inputStyle("req_tp_aa")}
            onChange={setReqTpAa}
            label="Active Area (mm)"
            fieldname="reqTpAa"
          />
          <DataList
            options={[]}
            value={reqTpOd}
            className={inputStyle("req_tp_od")}
            onChange={setReqTpOd}
            label="Outline Dimensions (mm)"
            fieldname="reqTpOd"
          />

          <div className="field m-3">
            <label className="label is-small">
              Special requirements (if any)
            </label>
            <textarea
              className="input is-400"
              name="req_tp_spec"
              value={reqTpSpec}
              onChange={(e) => setReqTpSpec(e.target.value)}
            />
          </div>
        </div>
      </article>

      <article className=" m-3">
        <div className="panel-block">Others</div>
        <div className="field m-3">
          <label className="label is-small">
            Other devices (eg.: Industrial Computers, etc.) OR just commentary
            for an engineer...
          </label>
          <textarea
            className="input h-70"
            name="conclusions"
            value={reqOthers}
            onChange={(e) => setReqOthers(e.target.value)}
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
    <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-400">
      <p className="title is-4 mb-6 mt-3">Please Wait...</p>
      <p className="subtitle">Signing into ClickUp...</p>
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

export default NewRfq;
