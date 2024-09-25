/** @format */
"use client";

import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      style={{ padding: 0, margin: 0, display: "flex", flexDirection: "row" }}
    >
      <SideBarComponent />
      <div style={{ padding: 0, margin: 0, width: "70%" }}>
        <h1>Remuneration Rate Sheet</h1>
        <Image
          src="/pdf_generation/pdfgenerator/assets/RenumerationRateSheet.jpg"
          alt="Renumeration Rate Sheet"
          width={600} // Specify width
          height={400} // Specify height
        />
      </div>
    </div>
  );
}

export default RemunerationRateSheet;
