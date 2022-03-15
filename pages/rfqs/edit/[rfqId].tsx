import type { AppContext } from "next/app";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import { UserPicker } from "../../../components/user-picker";
import { IUser } from "../../users";
import { NiceButton } from "../../../components/nice-button";
import { useRequest } from "../../../hooks/useRequest";
import { ssrRequest } from "../../../api/ssr-request";
import { IRfq } from "../";

interface IRfqWithIds extends IRfq {
  customer_id: number;
  distributor_id: number;
  pm_id: number;
  kam_id: number;
  final_solutions: string;
  conclusions: string;
  samples_expected: string;
  mp_expected: string;
  eau_max: number;
}

interface EditRfqProps {
  rfq: IRfqWithIds;
  currentUser: IUser;
}

const EditRfq = ({ rfq, currentUser }: EditRfqProps) => {
  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  });

  if (!currentUser) {
    return <div></div>;
  }

  if (!rfq) {
    return <h1>RFQ not found</h1>;
  } else {
    const {
      rfq_code,
      extra_note,
      eau,
      customer_id,
      distributor_id,
      pm_id,
      kam_id,
      id,
      final_solutions,
      conclusions,
      samples_expected,
      mp_expected,
      eau_max,
    } = rfq;

    const [newExtraNote, setExtraNote] = useState(extra_note);
    const [newEau, setEau] = useState(eau);
    const [newCustomerId, setCustomerId] = useState(customer_id);
    const [newDistributorId, setDistributorId] = useState(distributor_id);
    const [newPmId, setPmId] = useState(pm_id);
    const [newKamId, setKamId] = useState(kam_id);
    const [newFinalSolutions, setFinalSolutions] = useState(final_solutions);
    const [newConclusions, setConclusions] = useState(conclusions);
    const [newSamplesExpected, setSamplesExpected] = useState(samples_expected);
    const [newMpExpected, setMpExpected] = useState(mp_expected);
    const [newEauMax, setEauMax] = useState(eau_max);
    const { doRequest, errorsJSX, inputStyle } = useRequest({
      url: `/rfqs/${id}`,
      method: "put",
      body: {
        extra_note: newExtraNote,
        eau: newEau,
        customer_id: newCustomerId,
        distributor_id: newDistributorId,
        pm_id: newPmId,
        kam_id: newKamId,
        final_solutions: newFinalSolutions,
        conclusions: newConclusions,
        samples_expected: newSamplesExpected,
        mp_expected: newMpExpected,
        eau_max: newEauMax,
      },
      onSuccess: () => Router.push(`/rfqs/${id}`),
    });

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await doRequest();
    };

    const onCancel = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      Router.push(`/rfqs/${id}`);
    };

    return (
      <div className="full-page">
        <div className="card max-w-900 m-3 big-shadow">
          <div className="card-content">
            <form onSubmit={onSubmit}>
              <h1 className="title m-3 mb-5 is-4">
                <i className="fas fa-edit mr-1"></i> Edit {rfq_code}
              </h1>
              <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                <div className="field m-3">
                  <label className="label">Extra Note</label>
                  <input
                    className={inputStyle("extra_note")}
                    type="text"
                    value={newExtraNote}
                    autoFocus
                    onChange={(e) => setExtraNote(e.target.value)}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">EAU min</label>
                  <input
                    className={inputStyle("eau")}
                    name="eau"
                    type="number"
                    required
                    autoFocus
                    value={newEau}
                    onChange={(e) => setEau(parseInt(e.target.value))}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">EAU max</label>
                  <input
                    className={inputStyle("eau_max")}
                    name="eau_max"
                    type="number"
                    value={newEauMax}
                    onChange={(e) => setEauMax(parseInt(e.target.value))}
                  />
                </div>

                <UserPicker
                  handleChange={setCustomerId}
                  label="Customer"
                  fieldname="newCustomerId"
                  fetch="/customers"
                  initialValue={newCustomerId}
                />

                <UserPicker
                  handleChange={setDistributorId}
                  label="Distributor"
                  fieldname="newDistributorId"
                  fetch="/distributors"
                  initialValue={newDistributorId}
                />

                <UserPicker
                  handleChange={setPmId}
                  label="PM"
                  fieldname="newPmId"
                  fetch="/users"
                  initialValue={newPmId}
                />

                <UserPicker
                  handleChange={setKamId}
                  label="KAM"
                  fieldname="newKamId"
                  fetch="/users"
                  initialValue={newKamId}
                />

                <div className="field m-3">
                  <label className="label">Samples Expected</label>
                  <input
                    className={inputStyle("samples_expected")}
                    type="text"
                    value={newSamplesExpected}
                    onChange={(e) => setSamplesExpected(e.target.value)}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">MP Expected</label>
                  <input
                    className={inputStyle("mp_expected")}
                    type="text"
                    value={newMpExpected}
                    onChange={(e) => setMpExpected(e.target.value)}
                  />
                </div>
              </div>
              <div className="is-flex is-flex-direction-row is-flex-wrap-wrap">
                <div className="field m-3">
                  <label className="label">Final Solutions</label>
                  <textarea
                    className="textarea is-400"
                    name="final_solutions"
                    value={newFinalSolutions}
                    onChange={(e) => setFinalSolutions(e.target.value)}
                  />
                </div>

                <div className="field m-3">
                  <label className="label">Conclusions</label>
                  <textarea
                    className="textarea is-400"
                    name="conclusions"
                    value={newConclusions}
                    onChange={(e) => setConclusions(e.target.value)}
                  />
                </div>
              </div>

              {errorsJSX()}
              <div className="m-3 mt-6 ">
                <NiceButton>
                  <i className="far fa-save"></i>
                  <span className="m-1"></span> Save RFQ
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
  }
};

EditRfq.getInitialProps = async (ctx: AppContext["ctx"]) => {
  const { rfqId } = ctx.query;
  const url = `/rfqs/${rfqId}`;
  const { data } = await ssrRequest(ctx, url);
  return { rfq: data };
};

export default EditRfq;
