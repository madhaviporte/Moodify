import React, { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import Player from "../Player";
import "./Layout.scss";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main className="app-layout__main">
        <Header onMenuToggle={toggleSidebar} />

        <div className="app-layout__content">
          <Outlet />
        </div>
      </main>

      <Player />
    </div>
  );
};

export default Layout;
