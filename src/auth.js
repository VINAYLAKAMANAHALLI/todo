import API from "./api";


// REGISTER
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  // Save token
  localStorage.setItem("token", res.data.token);

  return res.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
};
