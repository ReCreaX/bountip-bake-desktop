import { Suspense } from "react";
import AuthPageClient from "./AuthPageClient";

const AuthPage = () => {
  return (
    <Suspense fallback={<div></div>}>
      <AuthPageClient />
    </Suspense>
  );
};

export default AuthPage;
