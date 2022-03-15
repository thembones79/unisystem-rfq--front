export const ROOT_URL =
  process.env.NODE_ENV === "production"
    ? "https://unisystem-rfq.herokuapp.com/api/v1"
    : "http://localhost:3090/api/v1";
