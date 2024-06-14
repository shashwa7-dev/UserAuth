import { axiosPrivate } from "@/api/axios";
import { useAuthState } from "@/context/AuthProvider";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const { auth } = useAuthState();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: any) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.token}`;
        }
        return config;
      },
      (error: any) => {
        Promise.reject(error); //incase if-block is skipped or something goes wrong
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      //S1-return response if all good
      (response: any) => response,

      //S2-handle error incase of api error (like auth etc)
      async (error: any) => {
        //S2.A> get the req that caused the error, axios's 'error.config' return that.
        const prevRequest = error?.config;
        //S2.B> check for error code if its due to auth token expiry and prevRequest is not sent/handled, to avoid infinite loop
        if ([403].includes(error?.response?.status) && !prevRequest?.sent) {
          prevRequest.sent = true; //setting true befor sending prev request
          //generating new accesstoken from refresh() api.
          const newAccessToken = await refresh();
          //re-initializing the header again with valid access token.
          const updatedToken = `Bearer ${newAccessToken}`;
          prevRequest.headers["Authorization"] = updatedToken;
          //finally resending the prev failed req again
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error); //incase if-block is skipped
      }
    );

    return () => {
      //cleanup both response and request interceptors as they dont clean up on their own and eventually piles up
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
