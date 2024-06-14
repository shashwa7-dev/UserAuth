import { useAuthState } from "@/context/AuthProvider";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, persist } = useAuthState();
  const refresh = useRefreshToken();
  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log("error verifying refresh token", err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.token ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);
  //   useEffect(() => {
  //     console.log("isLoading", isLoading);
  //     console.log("at:", JSON.stringify(auth?.token));
  //   }, [isLoading]);
  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
