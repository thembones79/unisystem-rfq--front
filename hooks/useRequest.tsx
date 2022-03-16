import axios from "axios";
import { useState } from "react";
import { ROOT_URL, headers } from "../config";

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
  const [errors, setErrors] = useState<{ message: string; field?: string }[]>(
    []
  );

  const errorsJSX = () => (
    <div>
      {errors.map((err) => (
        <div key={err?.message} className="notification is-danger is-light m-3">
          {err?.message}
        </div>
      ))}
    </div>
  );

  const inputStyle = (fieldName: string) => {
    return `input ${
      errors.map((err) => err.field).includes(fieldName) && "is-danger"
    }`;
  };

  const doRequest = async (props = {}) => {
    console.log(headers);
    try {
      const response = await axios[method](
        ROOT_URL + url,
        {
          ...body,
          ...props,
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
