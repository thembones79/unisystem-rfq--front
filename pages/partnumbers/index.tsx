import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { IColumn, SfTable } from "../../components/sf-table";

interface RfqsTableProps {
  currentUser: IUser;
}

export interface IProject {
  id: number;
  project_code: string;
  department: string;
  client: string;
  industry: string;
  pm: string;
  kam: string;
  updated: string;
}

const columns: IColumn<IProject>[] = [
  { name: "project_code", label: "Code" },
  { name: "client", label: "Client" },
  { name: "industry", label: "Industry" },
  { name: "department", label: "Department" },
  { name: "pm", label: "PM" },
  { name: "kam", label: "KAM" },
  { name: "updated", label: "Updated" },
];

const RfqsTable: React.FC<RfqsTableProps> = ({ currentUser }) => {
  const [rows, setRows] = useState<IProject[]>([]);
  const { doRequest, errorsJSX } = useRequest({
    url: "/projects",
    method: "get",
    onSuccess: (projects: IProject[]) => setRows(projects),
  });

  const handleNewProject = () => Router.push(`/projects/new`);

  useEffect(() => {
    doRequest();
  }, []);

  return rows.length > 0 ? (
    <div>
      <div className="m-5">
        <NiceButton onClick={handleNewProject}>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> New Project
        </NiceButton>
      </div>
      <div className="table-container">
        <SfTable columns={columns} rows={rows} route="projects" />
        {errorsJSX()}
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default RfqsTable;
