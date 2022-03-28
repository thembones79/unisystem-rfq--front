import React, { useState, useEffect } from "react";
import Router from "next/router";
import { IUser } from "../users";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";
import { Loader } from "../../components/loader";

export interface IClient {
  id: number;
  name: string;
  code: string;
  kam: string;
  kam_id: number;
}

interface ClientsTableProps {
  currentUser: IUser;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ currentUser }) => {
  const [clientsTable, setClientsTable] = useState<IClient[]>([]);

  const { doRequest, errorsJSX } = useRequest({
    url: `/clients`,
    method: "get",
    onSuccess: (clients: IClient[]) => setClientsTable(clients),
  });

  const renderTableHeader = () => {
    if (clientsTable.length > 0) {
      const columns = ["name", "code", "kam", ""];
      return columns.map((column) => {
        return (
          <th className={column === "" ? "is-200" : "p-2"} key={column}>
            {column}
          </th>
        );
      });
    }
  };

  const renderTableBody = () => {
    return clientsTable.map((client) => {
      const { name, code, kam, id } = client;
      return (
        <tr key={id}>
          <td className="p-2">{name}</td>
          <td className="p-2">{code}</td>
          <td className="p-2">{kam}</td>
          <td className="is-200 p-2">
            <button
              onClick={() => {
                handleEditClient(id);
              }}
              className="button is-link is-inverted is-rounded is-small mx-1 p-3"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => {
                handleDeleteClient(id);
              }}
              className="button is-danger is-inverted  is-rounded is-small mx-1 p-3"
            >
              <i className="fas fa-skull-crossbones"></i>
            </button>
          </td>
        </tr>
      );
    });
  };

  const handleEditClient = (id: number) => Router.push(`/clients/edit/${id}`);

  const handleNewClient = () => Router.push(`/clients/new`);

  const handleDeleteClient = (id: number) =>
    Router.push(`/clients/delete/${id}`);

  useEffect(() => {
    doRequest();
  }, []);

  return currentUser ? (
    <div className="table-container">
      <div className="mx-5 mt-2 mb-5">
        <NiceButton onClick={handleNewClient}>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> New Client
        </NiceButton>

        <table className="table is-narrow is-striped is-hoverable is-fullwidth is-size-7 mt-5">
          <thead>
            <tr>{renderTableHeader()}</tr>
          </thead>
          <tbody className="fixed200 ">{renderTableBody()}</tbody>
        </table>
      </div>

      {errorsJSX()}
    </div>
  ) : (
    <Loader />
  );
};

export default ClientsTable;
