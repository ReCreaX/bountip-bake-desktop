import { useAuthStore } from "@/stores/useAuthStore";
import PinInput from "@/components/Inputs/PinInput";
import { COOKIE_NAMES, setCookie } from "@/utils/cookiesUtils";
import { toast } from "sonner";
import authService from "@/services/authServices";

interface SetUpPinProps {
  onNext: () => void;
}
const SetUpPin = ({ onNext }: SetUpPinProps) => {
  const pin = useAuthStore((state) => state.pin);

  const handlePinSetUp = async () => {
    if (pin.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response:any = await authService.pinLogin({ pin });

    if (response.error) {
      toast.error(response.message || "PIN setup failed", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    if (response.status) {
      toast.success("PIN setup successful", {
        duration: 4000,
        position: "bottom-right",
      });

      if (response.data?.tokens) {
        setCookie(
          COOKIE_NAMES.BOUNTIP_REGISTERED_USERS,
          // "bountipRegisteredUsers",
          {
            accessToken: response.data.tokens.accessToken,
            refreshToken: response.data.tokens.refreshToken,
          },
          { expiresInMinutes: 60 * 120 }
        );
      }

      onNext();
    }
  };

  return (
    <>
      <h3 className="text-[#1E1E1E] text-[26px] font-bold mt-6 mb-4 text-center">
        Create a <span className="text-[#15BA5C]">Pin</span>
      </h3>
      <h4 className="text-center text-xl font-medium text-[#1E1E1E] my-3">
        Create a 4-digit Pin you can easily remember
      </h4>
      <div className="flex flex-col gap-4">
        <PinInput
          onSubmitPin={handlePinSetUp}
          onPinChange={(pin) => console.log("Current PIN:", pin)}
          showToggleVisibility={true}
        />

        <button
          onClick={handlePinSetUp}
          className="bg-[#15BA5C] rounded-xl py-3 font-bold text-[#FFFFFF]"
          type="button"
        >
          Create Pin
        </button>
      </div>
    </>
  );
};

export default SetUpPin;
