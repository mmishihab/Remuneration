/** @format */
"use client";

import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { rateSheetImage64 } from "../../../assets/rateSheetImage64";

function RemunerationRateSheet() {
  const { savedUser } = useContext(UserContext);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component has mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !savedUser) {
      router.replace("/");
    }
  }, [isClient, savedUser, router]);

  // Render nothing until the component has mounted on the client side
  if (!isClient || !savedUser) {
    return null;
  }

  return (
    <div
      style={{ padding: 0, margin: 0, display: "flex", flexDirection: "row",height:"100vh"  }}
    >
      <SideBarComponent />
      <div style={{ padding: 20, marginBottom: 0, width: "70%", overflowY: "auto", maxHeight: "100vh"}}>
        <h1>Remuneration Rate Sheet</h1>
        <div style={{ overflowY: "auto", maxHeight: "80vh"  }}>
          <Image
          src={rateSheetImage64}
          alt="Renumeration Rate Sheet"
          width={1000} // Specify width
          height={1300} // Specify height
        />
        </div>
        
      </div>
    </div>
  );
}

export default RemunerationRateSheet;
