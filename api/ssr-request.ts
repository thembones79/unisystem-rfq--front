import axios from "axios";
import type { AppContext } from "next/app";
import { ROOT_URL } from "../config";

export const ssrRequest = async (ctx: AppContext["ctx"], url: string) => {
  const options =
    typeof window === "undefined"
      ? { headers: ctx.req?.headers, withCredentials: true }
      : { withCredentials: true };

  try {
    const { data } = await axios.get(ROOT_URL + url, options);

    return { data };
  } catch (error) {
    console.warn(error);
    return { data: null };
  }
};
