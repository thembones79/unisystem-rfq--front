import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { IColumn, SfTable } from "../../components/sf-table";

interface RfqsTableProps {
  currentUser: IUser;
}

export interface IRfq {
  id: number;
  rfq_code: string;
  extra_note: string;
  for_valuation: boolean;
  eau: number;
  customer: string;
  pm: string;
  kam: string;
  updated: string;
  department: string;
  name: string;
  req_disp_tech: string;
  req_disp_size: string;
  req_disp_res: string;
  req_disp_brigt: string;
  req_disp_angle: string;
  req_disp_od: string;
  req_disp_aa: string;
  req_disp_inter: string;
  req_disp_ot: string;
  req_disp_st: string;
  req_disp_spec: string;
  req_tp_size: string;
  req_tp_aa: string;
  req_tp_tech: string;
  req_tp_od: string;
  req_tp_inter: string;
  req_tp_glass: string;
  req_tp_spec: string;
  req_others: string;
}

const columns: IColumn<IRfq>[] = [
  { name: "rfq_code", label: "RFQ Code" },
  { name: "extra_note", label: "Name" },
  { name: "eau", label: "EAU" },
  { name: "customer", label: "Customer" },
  { name: "department", label: "Department" },
  { name: "pm", label: "PM" },
  { name: "kam", label: "KAM" },
  { name: "for_valuation", label: "For Valuation" },
  { name: "updated", label: "Updated" },
];

const RfqsTable: React.FC<RfqsTableProps> = ({ currentUser }) => {
  const [rows, setRows] = useState<IRfq[]>([]);
  const { doRequest, errorsJSX } = useRequest({
    url: "/rfqs",
    method: "get",
    onSuccess: (rfqs: IRfq[]) => setRows(rfqs),
  });

  const handleNewRfq = () => Router.push(`/rfqs/new`);

  useEffect(() => {
    doRequest();
  }, []);
  return (
    <div>
      <div className="m-5">
        <NiceButton onClick={handleNewRfq}>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> New RFQ
        </NiceButton>
      </div>
      {rows.length > 0 ? (
        <div className="table-container">
          <SfTable columns={columns} rows={rows} route="rfqs" />
          {errorsJSX()}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default RfqsTable;
