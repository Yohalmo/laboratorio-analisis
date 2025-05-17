import React from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

interface Props {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<Props> = ({ children }) => {
  return (
      <div>
        <Navbar />
        <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: "20px"  }}>
            {children}
        </main>
        </div>
    </div>
  );
};

export default PrivateLayout;
