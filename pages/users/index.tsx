import React, { useState, useEffect } from "react";
import Router from "next/router";
import { useRequest } from "../../hooks/useRequest";
import { NiceButton } from "../../components/nice-button";

export interface IUser {
  id: number;
  email: string;
  username: string;
  shortname: string;
  role_id: number;
  role?: string;
}

interface UsersTableProps {
  currentUser: IUser;
}

const UsersTable: React.FC<UsersTableProps> = ({ currentUser }) => {
  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    }
  });

  const [usersTable, setUsersTable] = useState<IUser[]>([]);

  const { doRequest, errorsJSX } = useRequest({
    url: `/usersandadmins`,
    method: "get",
    onSuccess: (users: IUser[]) => setUsersTable(users),
  });

  const renderTableHeader = () => {
    if (usersTable.length > 0) {
      const columns = ["username", "shortname", "role", ""];
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
    return usersTable.map((user) => {
      const { username, shortname, role, id } = user;
      return (
        <tr key={id}>
          <td className="p-2">{username}</td>
          <td className="p-2">{shortname}</td>
          <td className="p-2">{role}</td>
          <td className="is-200 p-2">
            <button
              onClick={() => {
                handleEditUser(id);
              }}
              className="button is-link is-inverted is-rounded is-small mx-1 p-3"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => {
                handleChangePassword(id);
              }}
              className="button is-warning is-inverted  is-rounded is-small mx-1 p-3"
            >
              <i className="fas fa-key"></i>
            </button>
            <button
              onClick={() => {
                handleDeleteUser(id);
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

  const handleEditUser = (id: number) => Router.push(`/users/edit/${id}`);

  const handleNewUser = () => Router.push(`/users/new`);

  const handleDeleteUser = (id: number) => Router.push(`/users/delete/${id}`);

  const handleChangePassword = (id: number) =>
    Router.push(`/users/changepassword/${id}`);

  useEffect(() => {
    doRequest();
  }, []);

  return currentUser ? (
    <div className="table-container">
      <div className="mx-5 mt-2 mb-5">
        <NiceButton onClick={handleNewUser}>
          <i className="far fa-check-circle"></i>
          <span className="m-1"></span> Create User
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
    <div></div>
  );
};

export default UsersTable;
