import React, { useState } from "react";
import { C, FONT_BODY } from "../../constants/theme";
import Sidebar from "./Sidebar";
import MobileDrawer from "./MobileDrawer";
import Topbar from "./Topbar";
import MobileBottomNav from "./MobileBottomNav";
import ToastStack from "../common/ToastStack";

export default function AppShell({
  children,
  tab,
  setTab,
  user,
  isDirector,
  onSignOut,
  pendingApprovalsCount,
  searchQ,
  setSearchQ,
  searchOpen,
  setSearchOpen,
  searchResults,
  notifItems,
  toasts,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: C.bg, fontFamily: FONT_BODY, color: C.text }}
    >
      <Sidebar
        tab={tab}
        setTab={setTab}
        user={user}
        isDirector={isDirector}
        pendingApprovalsCount={pendingApprovalsCount}
        onSignOut={onSignOut}
      />

      <MobileDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        tab={tab}
        setTab={setTab}
        pendingApprovalsCount={pendingApprovalsCount}
        onSignOut={onSignOut}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          tab={tab}
          user={user}
          isDirector={isDirector}
          searchQ={searchQ}
          setSearchQ={setSearchQ}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchResults={searchResults}
          setTab={setTab}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          notifItems={notifItems}
          onMobileMenuOpen={() => setMobileNavOpen(true)}
          onSignOut={onSignOut}
        />

        <main className="flex-1 p-3 sm:p-5 pb-20 md:pb-5">
          {children}
        </main>
      </div>

      <MobileBottomNav
        tab={tab}
        setTab={setTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      <ToastStack toasts={toasts} />
    </div>
  );
}
