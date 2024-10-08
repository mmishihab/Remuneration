/** @format */
import NavbarComponent from "../../components/NavBar.component";
import UserContextProvider from "../../context/user.context";

export const metadata = {
  title: "Digital Remuneration System - Enhance Transparency and Efficiency",
  description: "Created By: Abdulla Al Mujahidul Islam",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

      </head>

      <body style={styles.body}>
        <UserContextProvider>
          <NavbarComponent />
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "sans-serif",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
};
