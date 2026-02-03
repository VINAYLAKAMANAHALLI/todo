import API from "./api";

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  localStorage.setItem("token", res.data.token);
  if (res.data.name) {
    localStorage.setItem("name", res.data.name);
  } else if (res.data.user && res.data.user.name) {
    localStorage.setItem("name", res.data.user.name);
  }
  return res;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
};
