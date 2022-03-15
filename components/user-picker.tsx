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

export interface UserPickerProps {
  handleChange: React.Dispatch<React.SetStateAction<number>>;
  label: string;
  fieldname: string;
  fetch: string;
  initialValue?: number;
}

export const UserPicker: React.FC<UserPickerProps> = ({
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
          <select
            name={fieldname}
            id={fieldname}
            value={initialValue}
            required
            onChange={(e) => {
              handleChange(parseInt(e.target.value));
            }}
          >
            <option></option>
            {renderOptions()}
          </select>
        </div>
      </div>
    </div>
  );
};
