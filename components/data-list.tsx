import React, { useState, useEffect } from "react";
import { useRequest } from "../hooks/useRequest";

export interface IOptionalUser {
  id: number;
  email?: string;
  username?: string;
  name?: string;
  shortname?: string;
  role_id?: number;
}

export interface DataListProps {
  handleChange: React.Dispatch<React.SetStateAction<number>>;
  label: string;
  fieldname: string;
  fetch: string;
  initialValue?: number;
}

export const DataList: React.FC<DataListProps> = ({
  handleChange,
  label,
  fieldname,
  fetch,
  initialValue,
}) => {
  const [usersList, setUsersList] = useState<IOptionalUser[]>([]);
  const { doRequest, errorsJSX, errors } = useRequest({
    url: fetch,
    method: "get",
    onSuccess: (list: IOptionalUser[]) => setUsersList(list),
  });

  const renderOptions = () => {
    return usersList.map(({ name, id }) => (
      <option key={id} value={id}>
        {name}
      </option>
    ));
  };

  useEffect(() => {
    doRequest();
  }, []);

  return errors.length ? (
    <div>{errorsJSX()}</div>
  ) : (
    <div>
      <div className="field m-3">
        <label className="label">{label}</label>

        <div className={`select ${usersList.length === 0 ? "is-loading" : ""}`}>
          <input
            name={fieldname}
            list="mechanics"
            type="text"
            value={initialValue}
            required
            onChange={(e) => {
              handleChange(parseInt(e.target.value));
            }}
          />
        </div>
        <datalist id={fieldname}>{renderOptions()}</datalist>
      </div>
    </div>
  );
};
