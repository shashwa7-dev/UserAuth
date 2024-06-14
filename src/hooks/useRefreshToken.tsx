import axios from "@/api/axios";
import { AuthState, useAuthState } from "@/context/AuthProvider";
import { jwtDecode } from "jwt-decode";

const useRefreshToken = () => {
  const { setAuth } = useAuthState();
  const refresh = async () => {
    const response = await axios.get("/refreshToken", {
      withCredentials: true,
    });
    let accessToken = response.data.accessToken;
    //extract info from the access token
    //@ts-ignore
    const roles = jwtDecode(accessToken)?.UserInfo?.roles;
    //@ts-ignore
    const user = jwtDecode(accessToken)?.UserInfo?.username;
    //update auth state
    setAuth((prev: AuthState) => {
      console.log("prev auth state:", JSON.stringify(prev));
      console.log("auth state from ref api:", accessToken);
      return { roles, token: accessToken, user };
    });
    return response.data.accessToken;
  };

  return refresh;
};
export default useRefreshToken;
