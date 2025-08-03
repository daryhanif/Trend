import axios from "axios";
interface ErrorResponse {
  message?: string;
  // tambahkan properti lain sesuai backend
}

export const axiosInstanceInternal = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("tokenAccsess") || ""}`,
  },
});

axiosInstanceInternal.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorConfig = error.config;
    const data = error.response?.data as ErrorResponse | undefined;

    if (error.response?.status === 401 && data?.message?.includes("jwt")) {
      errorConfig._retry = true;
      try {
        const getNewAccsesToken = await axiosInstanceInternal.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        if (!getNewAccsesToken) return Promise.reject(error);

        const { tokenAccsess } = getNewAccsesToken.data;
        localStorage.setItem("tokenAccsess", tokenAccsess);
        axiosInstanceInternal.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenAccsess}`;
        return axiosInstanceInternal(errorConfig);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const axiosInstanceExternal = axios.create({});
