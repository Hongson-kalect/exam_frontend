export const fetchData = async (
  url = "",
  method: string = "GET",
  data = {},
  headers: string = "application/json"
) => {
  const fetchOptions: any = {
    method: method || "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": headers,
      // "Content-type": "multipart/form-data",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  if (!["get", "GET", "delete", "DELETE"].includes(method))
    fetchOptions.body = JSON.stringify(data);
  // Default options are marked with *
  const response = await fetch(
    process.env.REACT_APP_BACKEND_PORT + "/" + url,
    fetchOptions
  );
  return response.json(); // parses JSON response into native JavaScript objects
};
