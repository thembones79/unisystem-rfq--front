import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { IColumn, SfTable } from "../../components/sf-table";

interface PartnumbersTableProps {
  currentUser: IUser;
}

export interface IPartnumber {
  id: number;
  pn: string;
  project: string;
  project_id: number;
  department: string;
  client: string;
  industry: string;
  pm: string;
  kam: string;
  updated: string;
}

const columns: IColumn<IPartnumber>[] = [
  { name: "pn", label: "Code" },
  { name: "project", label: "Project" },
  { name: "client", label: "Client" },
  { name: "industry", label: "Industry" },
  { name: "department", label: "Department" },
  { name: "pm", label: "PM" },
  { name: "kam", label: "KAM" },
  { name: "updated", label: "Updated" },
];

const PartnumbersTable: React.FC<PartnumbersTableProps> = ({ currentUser }) => {
  const [rows, setRows] = useState<IPartnumber[]>([]);
  const { doRequest, errorsJSX } = useRequest({
    url: "/partnumbers",
    method: "get",
    onSuccess: (partnumbers: IPartnumber[]) => setRows(partnumbers),
  });

  const handleNewPartnumber = () => Router.push(`/partnumbers/new`);

  useEffect(() => {
    doRequest();
  }, []);

  return rows.length > 0 ? (
    <div>
      <div className="table-container">
        <SfTable columns={columns} rows={rows} route="partnumbers" />
        {errorsJSX()}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default PartnumbersTable;
