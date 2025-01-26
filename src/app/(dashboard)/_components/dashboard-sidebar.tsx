"use client"
import { ScrollArea } from "@/components/ui/scroll-area";
import { sidebarContents } from "@/data/vendor-dashboard-data";
import { cn } from "@/lib/utils";
import DashboardSidebarItem from "./dashboard-sidebar-item";
import Image from "next/image";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import LogOutModal from "@/components/shared/modal/logOutModal";
import Link from "next/link";

const DashSidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const handleLogout = () => {
    setShowModal(true);
  };
  const confirmLogout = () => {
    console.log("User logged out");
    setShowModal(false);
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>

      <div style={{
        backgroundImage: "url('/assets/img/dashboard_sidebar_bg.svg')",
      }} className="bg-cover bg-center bg-no-repeat h-screen w-[354px] bg-white rounded-tr-lg shadow-[0px_28px_20px_0px_#0000000D] sticky top-0 pt-[20px] -mt-24">
        <ScrollArea className="h-full overflow-y-auto">
          <div>
            <div className="bg-[#F9FAFD] flex justify-center items-center gap-[12px] w-[266px] h-[95px] shadow-[0px_4px_22px_0px_#D3D8FF99] rounded-[36px] ml-[38px] mt-[32px] mr-[50px] ">
              <Image src="/assets/img/dashboard_logo.png" alt="dashboard_img" width={75} height={75} />
              <span className="text-[15px] font-semibold leading-[18px] text-[#00417E]">PACIFIC <br />
                RIM <br />
                FUSION</span>
            </div>
            <div className="w-full mx-auto space-y-[16px] pt-[60px]">
              {sidebarContents.map((item) => (
                <DashboardSidebarItem key={item.id} item={item} />
              ))}
            </div>

            <div className="">
              <div className="pl-[38px] pt-[80px]">
                <Link href="/help-support"
                  className={cn(
                    " w-full h-[46px] rounded-[4px] pl-[16px] flex items-center gap-[12px] font-medium text-[18px] leading-[21.4px] transition-colors duration-300 bg-transparent text-[#152764] hover:text-[#152764]"
                  )}
                >
                  <Image
                    src="/assets/img/help.png"
                    alt="help"
                    width={16}
                    height={16}
                  /> Help & Support
                </Link>
              </div>

              <div className="pl-[38px] pt-[16px] pb-[563px]">
                <button
                  onClick={(e) => {
                    {
                      e.preventDefault();
                      handleLogout();

                    }
                  }}
                  className={cn(
                    " w-full h-[46px] rounded-[4px] pl-[16px] flex items-center gap-[12px] font-medium text-[18px] leading-[21.4px] transition-colors duration-300 bg-transparent text-[#152764] hover:text-[#152764]"
                  )}
                >
                  <LogOutIcon className="w-[16px] h-[16px]" /> Logout
                </button>
              </div>
            </div>
          </div>

        </ScrollArea>

      </div>
      {
        showModal && (<LogOutModal cancelLogout={cancelLogout} confirmLogout={confirmLogout} />)
      }

    </>

  );
};

export default DashSidebar;