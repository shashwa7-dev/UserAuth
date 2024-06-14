import axios from "@/api/axios";
import { useAuthState } from "@/context/AuthProvider";

const useLogout = () => {
  const { setAuth } = useAuthState();
  const logout = async () => {
    setAuth({});
    try {
      axios.get("/logout", {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  };
  return logout;
};

export default useLogout;
