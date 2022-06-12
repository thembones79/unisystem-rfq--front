import axios from "axios";
import { useState } from "react";
import { ROOT_URL, headers } from "../config";

export interface IError {
  message: string;
  field?: string;
}

export const useRequest = ({
  url,
  method,
  body,
  onSuccess,
}: {
  url: string;
  method: "get" | "put" | "post" | "delete" | "patch";
  body?: Object;
  onSuccess: Function;
}) => {
  const [errors, setErrors] = useState<IError[]>([]);

  const errorsJSX = () =>
    errors ? (
      <div>
        {errors.map((err) => (
          <div
            key={err?.message}
            className="notification is-danger is-light m-3"
          >
            {err?.message}
          </div>
        ))}
      </div>
    ) : null;

  const inputStyle = (fieldName: string) => {
    return `input ${
      errors.map((err) => err.field).includes(fieldName) && "is-danger"
    }`;
  };

  const doRequest = async (props = {}) => {
    try {
      const response = await axios[method](
        ROOT_URL + url,
        {
          ...body,
          ...props,
          //@ts-ignore
          headers,
        },

        { headers }
      );
      setErrors([]);

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error: any) {
      setErrors(error.response.data.errors);
    }
  };

  return { doRequest, errorsJSX, inputStyle, errors };
};
