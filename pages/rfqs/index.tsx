import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";

import { IColumn, SfTable } from "../../components/sf-table";

interface RfqsTableProps {
  currentUser: IUser;
}

export interface IRfq {
  id: number;
  rfq_code: string;
  extra_note: string;
  eau: number;
  customer: string;
  distributor: string;
  pm: string;
  kam: string;
  updated: string;
}

const columns: IColumn<IRfq>[] = [
  { name: "rfq_code", label: "RFQ Code" },
  { name: "extra_note", label: "Extra Note" },
  { name: "eau", label: "EAU" },
  { name: "customer", label: "Customer" },
  { name: "distributor", label: "Distributor" },
  { name: "pm", label: "PM" },
  { name: "kam", label: "KAM" },
  { name: "updated", label: "Updated" },
];

const RfqsTable = ({ currentUser }: RfqsTableProps) => {
  if (!currentUser) {
    useEffect(() => {
      Router.push("/");
    });
    return <div></div>;
  }

  const [rows, setRows] = useState<IRfq[]>([]);
  const { doRequest, errorsJSX } = useRequest({
    url: "/rfqs",
    method: "get",
    onSuccess: (rfqs: IRfq[]) => setRows(rfqs),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    rows.length > 0 && (
      <div className="table-container">
        <SfTable columns={columns} rows={rows} />
        {errorsJSX()}
      </div>
    )
  );
};

export default RfqsTable;
