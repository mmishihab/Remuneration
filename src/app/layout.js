/** @format */

import NavbarComponent from "../../components/NavBar.component";
import UserContextProvider from "../../context/user.context";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
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
    fontFamily: "Montserrat",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
};
