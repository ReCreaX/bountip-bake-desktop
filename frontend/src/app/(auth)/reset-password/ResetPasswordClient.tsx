"use client";
import AssetsFiles from "@/assets";
import {
  getStrength,
  getStrengthLabel,
  PasswordStrengthMeter,
} from "@/components/Forms/AuthForm";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  Fingerprint,
  Mail,
  MailOpen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  COOKIE_NAMES,
  getCookie,
  removeCookie,
  setCookie,
} from "@/utils/cookiesUtils";
import { toast } from "sonner";
import authService from "@/services/authServices";

const ResetPasswordClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get step from URL query param, default to 'forgot'
  const step = searchParams.get("step") || "forgot";

  // Helper to navigate to a step by updating query param
  const goToStep = (newStep: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", newStep);
    router.push(url.toString());
  };
  return (
    <section className="max-h-screen h-screen">
      <div className="flex items-center justify-between px-5">
        <Image src={AssetsFiles.LogoTwo} alt="Logo" />
        <section className="flex items-center gap-1.5">
          <p className="text-base">Remember Password?</p>
          <Link className="text-[#15BA5C] text-base" href="/auth?signin">
            Sign in here
          </Link>
        </section>
      </div>
      <div className="my-6 flex items-center justify-center">
        {step === "forgot" && <ForgotPassword onNext={() => goToStep("otp")} />}
        {step === "otp" && <OtpInput onNext={() => goToStep("create")} />}
        {step === "create" && (
          <CreateNewPassword onNext={() => goToStep("success")} />
        )}
        {step === "success" && <PasswordResetSuccessful />}
      </div>
    </section>
  );
};

export default ResetPasswordClient;

function ForgotPassword({ onNext }: { onNext: () => void }) {
  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await authService.forgotPassword({ email });
      console.log(response);

      if (response.error) {
        toast.error(response.message || "Failed to send reset code", {
          duration: 4000,
          position: "bottom-right",
        });
        return;
      }

      if (response.status) {
        toast.success("Reset code sent to your email", {
          duration: 4000,
          position: "bottom-right",
        });
        //setCookie("resetUserEmail", { email: email }, { expiresInMinutes: 30 });
        setCookie(
          COOKIE_NAMES.RESET_USER_EMAIL,
          { email: email },
          { expiresInMinutes: 30 }
        );
        onNext();
      }
    } catch (error) {
      console.error("Error sending forgot password:", error);
      toast.error("An error occurred. Please try again.", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  };

  return (
    <form className="flex flex-col justify-between items-center w-1/2 h-[75vh]">
      <div className="flex flex-col items-center justify-center w-full flex-grow gap-4">
        <div className="bg-[#15BA5C] px-5 py-3 rounded-xl">
          <Fingerprint className="text-white" />
        </div>
        <h3 className="text-xl text-center text-[#1E1E1E] font-bold">
          Forgot Password
        </h3>
        <p className="text-center">Enter your email for instructions</p>
        <div className="flex items-center border border-[#E6E6E6] rounded-xl p-4 w-full">
          <Mail className="text-[#1E1E1E]" />
          <span className="h-[30px] w-0.5 bg-[#E6E6E6] mx-1.5"></span>
          <div className="flex flex-col w-full">
            <label className="text-sm text-[#898989] mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="text-[#1E1E1E] text-base font-medium focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleForgotPassword}
        className="bg-[#15BA5C] text-white font-bold text-xl py-3.5 rounded-[10px] hover:bg-[#13a551] w-full"
        type="submit"
      >
        Send 4 Digit Code
      </button>
    </form>
  );
}

function OtpInput({ onNext }: { onNext: () => void }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };
  //const user = getCookie<{ email: string }>("resetUserEmail");
  const user = getCookie<{ email: string }>(COOKIE_NAMES.RESET_USER_EMAIL);
  if (!user) {
    router.push("/reset-password?step=otp");
  }
  console.log("This is user---", user);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some((digit) => digit === "")) return;
    const fullOtp = otp.join("");
    // setCookie("tokenUserEmail", { token: fullOtp }, { expiresInMinutes: 30 });
    setCookie(
      COOKIE_NAMES.TOKEN_USER_EMAIL,
      { token: fullOtp },
      { expiresInMinutes: 30 }
    );
    toast.success("OTP verified successfully", {
      duration: 4000, 
      position: "bottom-right",
    });
    onNext();
  };

  const handleResendOtpToEmail = async () => {
    try {
      if (!user?.email) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await authService.forgotPassword({
        email: user.email,
      });
      console.log(response);
      if (response.status) {
        // setCookie(
        //   "resetUserEmail",
        //   { email: user.email },
        //   { expiresInMinutes: 30 }
        // );

        setCookie(
          COOKIE_NAMES.RESET_USER_EMAIL,
          { email: user.email },
          { expiresInMinutes: 30 }
        );
        toast.success("Reset code sent to your email", {
          duration: 4000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error resending email", error);
      // Show error message here as needed
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between items-center w-1/2 h-[75vh]"
    >
      <div className="flex flex-col items-center justify-center w-full flex-grow gap-4">
        <div className="bg-[#15BA5C] px-5 py-3 rounded-xl">
          <MailOpen className="text-white" />
        </div>
        <h3 className="text-xl text-center text-[#1E1E1E] font-bold">
          Enter your Code
        </h3>
        <p className="text-sm text-[#1E1E1E] flex gap-1 text-center">
          We sent a code to <span className="font-bold">{user?.email}</span>
        </p>

        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div className="flex gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                className="w-[55px] h-14 text-center text-xl border rounded-lg focus:outline-none focus:border-[#15BA5C] border-gray-300"
              />
            ))}
          </div>

          <p className="text-sm text-gray-600">
            Didn’t receive the email?
            <button
              type="button"
              className="text-black font-medium underline hover:text-green-600 ml-1"
              onClick={handleResendOtpToEmail}
            >
              Click to resend
            </button>
          </p>
        </div>
      </div>
      <button
        className="bg-[#15BA5C] text-white font-bold text-xl py-3.5 rounded-[10px] hover:bg-[#13a551] w-full"
        type="submit"
      >
        Continue
      </button>
    </form>
  );
}

function CreateNewPassword({ onNext }: { onNext: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const strength = getStrength(newPassword);
  const { label } = getStrengthLabel(strength);

  // const user = getCookie<{ email: string }>("resetUserEmail");
  const user = getCookie<{ email: string }>(COOKIE_NAMES.RESET_USER_EMAIL);
  // const userToken = getCookie<{ token: string }>("tokenUserEmail");
  const userToken = getCookie<{ token: string }>(
    COOKIE_NAMES.TOKEN_USER_EMAIL
  );
  if (!user) {
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToken?.token && !user?.email) return;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (strength < 3) {
      alert("Please choose a stronger password");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await authService.resetPassword({
      email: user?.email as string,
      password: newPassword,
      token: userToken?.token as string,
    });
    if (response.status) {
      onNext();
      // removeCookie("resetUserEmail");
      removeCookie(COOKIE_NAMES.RESET_USER_EMAIL);
      // removeCookie("tokenUserEmail");
      removeCookie(COOKIE_NAMES.TOKEN_USER_EMAIL);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between items-center w-1/2 h-[75vh]"
    >
      <div className="flex flex-col items-center justify-center w-full flex-grow gap-4">
        <div className="bg-[#15BA5C] px-5 py-3 rounded-xl">
          <MailOpen className="text-white" />
        </div>
        <h3 className="text-xl text-center text-[#1E1E1E] font-bold">
          Set New Password
        </h3>
        <p className="text-[18px] text-[#1E1E1E] flex gap-1 text-center">
          Create a very strong Password you can remember
        </p>
        <div className="w-full flex flex-col gap-3.5">
          <div className="flex items-center border border-[#E6E6E6] rounded-xl p-4 w-full relative">
            <Image src={AssetsFiles.PasswordIcon} alt="Password Icon" />
            <span className="h-[30px] w-0.5 bg-[#E6E6E6] mx-1.5"></span>
            <div className="flex flex-col w-full relative">
              <label className="text-sm text-[#898989] mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  showPassword ? "Enter Password" : "***************"
                }
                className="text-[#1E1E1E] text-base font-medium focus:outline-none pr-8"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-4 text-[#1E1E1E] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center border border-[#E6E6E6] rounded-xl p-4 w-full relative">
            <Image src={AssetsFiles.PasswordIcon} alt="Password Icon" />
            <span className="h-[30px] w-0.5 bg-[#E6E6E6] mx-1.5"></span>
            <div className="flex flex-col w-full relative">
              <label className="text-sm text-[#898989] mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={
                  showConfirmPassword
                    ? "Enter Confirm Password"
                    : "***************"
                }
                className="text-[#1E1E1E] text-base font-medium focus:outline-none pr-8"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-4 text-[#1E1E1E] cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
          {newPassword && <PasswordStrengthMeter password={newPassword} />}
          {newPassword && (
            <p className="text-sm text-gray-600 mt-1 text-left">{label}</p>
          )}
        </div>
      </div>
      <button
        className="bg-[#15BA5C] text-white font-bold text-xl py-3.5 rounded-[10px] hover:bg-[#13a551] w-full"
        type="submit"
      >
        Continue
      </button>
    </form>
  );
}

function PasswordResetSuccessful() {
  return (
    <form className="flex flex-col justify-between items-center w-1/2 h-[75vh]">
      <div className="flex flex-col items-center justify-center w-full flex-grow gap-4">
        <div className="bg-[#15BA5C] px-5 py-3 rounded-xl">
          <BadgeCheck className="text-white" />
        </div>
        <h3 className="text-xl text-center text-[#1E1E1E] font-bold">
          All Done
        </h3>
        <p className="text-sm text-[#1E1E1E] flex gap-1 text-center">
          Your Password has been reset successfully
        </p>
      </div>

      <Link
        href="/auth?signin"
        className="bg-[#15BA5C] text-center text-white font-bold text-xl py-3.5 rounded-[10px] hover:bg-[#13a551] w-full"
      >
        Log in
      </Link>
    </form>
  );
}
