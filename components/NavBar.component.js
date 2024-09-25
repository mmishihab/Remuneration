/** @format */

"use client";

import React from "react";
import { color } from "./Color";
import { AiOutlineMenu } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

function NavbarComponent() {
  const router = useRouter();
  return (
    <>
      <div style={styles.navbar}>
        <div style={styles.menubar}>
          <div>
            <AiOutlineMenu
              color={color.white}
              size={28}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div style={styles.menutitle}>Digital Remuneration</div>
          <div>
            <MdAccountCircle
              color={color.white}
              size={28}
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/userProfile")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default NavbarComponent;

const styles = {
  navbar: {
    width: "100vw",
    backgroundColor: color.teal,
    height: "50px",
    display: "flex",
    justifyContent: "center",
  },

  menubar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    width: "90%",
  },

  menutitle: {
    fontSize: "24px",
    color: color.white,
    fontFamily: "montserrat",
  },
};
