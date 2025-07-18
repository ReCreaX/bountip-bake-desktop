"use client";
import AssetsFiles from "@/assets";
import { useModalStore } from "@/stores/useUIStore";
import { UserType } from "@/types/userTypes";
import { COOKIE_NAMES, getCookie, removeCookie } from "@/utils/cookiesUtils";
import {
  Bell,
  ChevronDown,
  ChevronsLeftRight,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const { setShowFullDashboardSidebar, showFullDashboardSidebar } =
    useModalStore();
    const router = useRouter();
    const handleLogOut=()=>{
      removeCookie(COOKIE_NAMES.BOUNTIP_LOGIN_USER);
      removeCookie(COOKIE_NAMES.BOUNTIP_LOGIN_USER_TOKENS)
      router.push("/auth?signin")
    }

  // const user = getCookie<UserType>("bountipLoginUser");
  const user = getCookie<UserType>(COOKIE_NAMES.BOUNTIP_LOGIN_USER);
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <section className="flex items-center gap-4">
        <Image src={AssetsFiles.LogoTwo} alt="Logo" className="w-[100px]" />
        <button className="bg-[#FBFBFB] border-[#C1C1C1] border" type="button">
          <ChevronsLeftRight
            onClick={() => {
              setShowFullDashboardSidebar(!showFullDashboardSidebar);
            }}
            className="text-[#1C1B20] font-light"
          />
        </button>
      </section>
      <section className="relative border border-[#E7E7E7] rounded-2xl py-3 pl-11 pr-6 w-1/3">
        <Search className="absolute left-1.5" />
        <input
          type="text"
          placeholder="Search for anything..."
          className="outline-none border-none"
          name=""
          id=""
        />
      </section>
      <section className="flex items-center gap-3.5 ">
        <div className="shadow-md rounded-full p-2.5  bg-white flex items-center gap-3 relative">
          <span className="absolute -top-2.5 right-1.5 bg-red-500 text-white text-[10px] px-1 py-1 rounded-full">
            16
          </span>
          <Bell className="text-[13px]" />
        </div>
        <div className="w-[300px]">
          <UserDropdown
            user={{
              fullName: user?.fullName || "Bake Main",
              avatar: AssetsFiles.UserPerson,
            }}
            onProfileSelect={(profile) => {
              console.log("Selected profile:", profile);
              // Handle profile switching logic here
            }}
            onSettingsClick={() => {
             router.push("/settings")
            }}
            onLogoutClick={handleLogOut}
          />
        </div>
      </section>
    </header>
  );
};

export default Header;

interface User {
  fullName: string;
  avatar: StaticImageData;
}

interface UserDropdownProps {
  user?: User;
  onProfileSelect?: (profile: string) => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user = {
    fullName: "Bake Main",
    avatar: "/placeholder-avatar.jpg",
  },
  onProfileSelect,
  onSettingsClick,
  onLogoutClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const profiles = [
    { name: "Bake Main", isActive: true },
    { name: "Bake Lekki", isActive: false },
    { name: "Bake Asaba", isActive: false },
    { name: "Bake Abuja", isActive: false },
  ];

  const toggleDropdown = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(!isOpen);
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  const handleProfileClick = (profileName: string) => {
    onProfileSelect?.(profileName);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full " ref={dropdownRef}>
      <div
        className=" flex w-full items-center justify-between gap-2.5 cursor-pointer rounded-3xl bg-[#FAFAFC] py-1 pr-2 pl-1  transition-colors duration-200 "
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2.5">
          <Image
            src={user.avatar}
            className="h-[40px] w-[40px] rounded-full object-cover"
            alt="User"
            width={40}
            height={40}
          />

          <h3 className="text-nowrap font-medium text-gray-900">
            {user.fullName}
          </h3>
        </div>

        <div className="flex gap-2.5 items-center">
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      <div
        className={`w-full absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200  overflow-hidden transition-all duration-300 ease-out transform origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
        }`}
        onTransitionEnd={handleAnimationEnd}
      >
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src={user.avatar}
                className="h-[32px] w-[32px] rounded-full object-cover"
                alt="User"
                width={32}
                height={32}
              />
              <span className="font-medium text-gray-900">{user.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="py-2">
          {profiles.slice(1).map((profile) => (
            <div
              key={profile.name}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleProfileClick(profile.name)}
            >
              <span className="text-gray-700 font-medium">{profile.name}</span>
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  profile.isActive
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                }`}
              >
                {profile.isActive && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 text-left"
            onClick={onSettingsClick}
          >
            <Settings className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700 font-medium">Settings</span>
            <ChevronDown className="h-3 w-3 text-gray-400 ml-auto rotate-[-90deg]" />
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors duration-150 text-left group"
            onClick={onLogoutClick}
          >
            <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
            <span className="text-red-500 font-medium group-hover:text-red-600">
              Log Out
            </span>
            <ChevronDown className="h-3 w-3 text-red-400 ml-auto rotate-[-90deg] group-hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
