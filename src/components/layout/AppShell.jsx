import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { C, FONT_BODY } from "../../constants/theme";
import Sidebar from "./Sidebar";
import MobileDrawer from "./MobileDrawer";
import Topbar from "./Topbar";
import MobileBottomNav from "./MobileBottomNav";
import ToastStack from "../common/ToastStack";

export default function AppShell({ user, isDirector, onSignOut, pendingApprovalsCount, notifItems, toasts }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex" style={{ background: C.bg, fontFamily: FONT_BODY, color: C.text }}>
      <Sidebar
        user={user}
        isDirector={isDirector}
        pendingApprovalsCount={pendingApprovalsCount}
        onSignOut={onSignOut}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pendingApprovalsCount={pendingApprovalsCount}
        onSignOut={onSignOut}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          user={user}
          isDirector={isDirector}
          notifItems={notifItems}
          onMobileMenuOpen={() => setDrawerOpen(true)}
          onSignOut={onSignOut}
        />
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 max-w-[1600px] w-full">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav pendingApprovalsCount={pendingApprovalsCount} />
      <ToastStack toasts={toasts} />
    </div>
  );
}
