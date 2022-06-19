import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { IColumn, SfTable } from "../../components/sf-table";

interface OffersTableProps {
  currentUser: IUser;
}

export interface IOffer {
  id: number;
  number: string;
  department: string;
  client: string;
  rfq: string;
  kam: string;
  updated: string;
}

const columns: IColumn<IOffer>[] = [
  { name: "number", label: "Number" },
  { name: "client", label: "Client" },
  { name: "rfq", label: "RFQ" },
  { name: "department", label: "Department" },
  { name: "kam", label: "KAM" },
  { name: "updated", label: "Updated" },
];

const OffersTable: React.FC<OffersTableProps> = ({ currentUser }) => {
  const [rows, setRows] = useState<IOffer[]>([]);
  const { doRequest, errorsJSX } = useRequest({
    url: "/offers",
    method: "get",
    onSuccess: (offers: IOffer[]) => setRows(offers),
  });

  const handleNewOffer = () => Router.push(`/offers/new/1`);

  useEffect(() => {
    doRequest();
  }, []);

  return rows.length > 0 ? (
    <div>
      {
        <div className="m-5">
          <NiceButton onClick={handleNewOffer}>
            <i className="far fa-check-circle"></i>
            <span className="m-1"></span> New Offer
          </NiceButton>
        </div>
      }
      <SfTable columns={columns} rows={rows} route="offers" />
      <div className="table-container">{errorsJSX()}</div>
    </div>
  ) : (
    <div></div>
  );
};

export default OffersTable;
