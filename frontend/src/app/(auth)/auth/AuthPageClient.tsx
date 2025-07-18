"use client";
import AssetsFiles from "@/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import AuthForm from "@/components/Forms/AuthForm";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { COOKIE_NAMES, getCookie } from "@/utils/cookiesUtils";

const AuthPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [active, setActive] = useState<"signin" | "signup">("signup");
  const { setPinLogin } = useAuthStore();

  useEffect(() => {
    // const token = getCookie<{
    //   accessToken: string;
    //   refreshToken: string;
    // }>("bountipLoginUserTokens");
    const token = getCookie<{
      accessToken: string;
      refreshToken: string;
    }>(COOKIE_NAMES.BOUNTIP_LOGIN_USER_TOKENS); // Use the constant COOKIE_NAMES for better maintainability

    console.log(token);
    if (token?.accessToken) {
      router.push("/dashboard");
    } else {
      router.push("/auth?signin");
    }
  }, [router]);

  useEffect(() => {
    const modeParam =
      searchParams.get("signin") !== null
        ? "signin"
        : searchParams.get("signup") !== null
        ? "signup"
        : null;

    if (modeParam === "signin" || modeParam === "signup") {
      setActive(modeParam);
    }
  }, [searchParams]);

  const handleActiveClick = (tab: "signin" | "signup") => {
    setPinLogin(false);
    setActive(tab);
    const newQuery = tab === "signin" ? "?signin" : "?signup";
    router.replace(`/auth${newQuery}`);
  };
  return (
    <section className="min-h-screen flex">
      <aside className="flex-1 relative min-h-screen">
        <Image
          src={AssetsFiles.AuthBgImage}
          alt="Auth pages"
          fill
          className="object-cover"
          style={{ objectPosition: '20% center' }}
        />
      </aside>

      <section className="flex-1 flex items-center justify-center my-12">
        <section className="flex items-center justify-center flex-col gap-3.5 w-[450px] ">
          <Image src={AssetsFiles.LogoTwo} alt="Logo" />
          <h3 className="text-[#1E1E1E] font-bold text-[45px]">Welcome Back</h3>
          <p className="text-[#1E1E1E] text-[25px] font-light text-center">
            Welcome back, Please Enter your details
          </p>

          <div className="inline-flex bg-gray-100 w-full rounded-md p-1 my-2.5">
            <button
              onClick={() => handleActiveClick("signin")}
              className={`px-4 py-2 rounded-md transition-all duration-200  flex-1 ${
                active === "signin"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleActiveClick("signup")}
              className={`px-4 py-2 rounded-md transition-all duration-200 flex-1 ${
                active === "signup"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          <AuthForm mode={active} />
        </section>
      </section>
    </section>
  );
};

export default AuthPageClient;
