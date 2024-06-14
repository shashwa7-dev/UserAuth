import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

type ContextProviderProps = {
  children: React.ReactNode;
};
// Define the type for the auth state
export interface AuthState {
  user?: string; // Example field, adjust according to your actual auth state
  token?: string; // Example field, adjust according to your actual auth state
  roles?: number[];
}

// Define the context type
interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
  persist: boolean;
  setPersist: Dispatch<SetStateAction<boolean>>;
}
export const AuthContext = createContext<AuthContextType>({
  auth: {},
  setAuth: () => {},
  persist: false,
  setPersist: () => {},
});

export const AuthContextProvider = ({ children }: ContextProviderProps) => {
  const [auth, setAuth] = useState<AuthState>({});
  const [persist, setPersist] = useState(
    Boolean(JSON.parse(localStorage.getItem("persist_auth") || "false")) ||
      false
  );
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthState() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a GloabalProvider");
  }
  return context;
}
