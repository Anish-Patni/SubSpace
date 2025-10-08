import { CivicAuthProvider as CivicProvider, UserButton } from "@civic/auth/react";
import { ReactNode } from "react";

interface CivicAuthProviderProps {
  children: ReactNode;
}

export const CivicAuthProvider = ({ children }: CivicAuthProviderProps) => {
  return (
    <CivicProvider clientId="77550b1f-b202-46be-ae5f-4b8b4650abbe">
      {children}
    </CivicProvider>
  );
};

export { UserButton } from "@civic/auth/react";
export { useUser } from "@civic/auth/react";
