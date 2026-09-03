import React from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { NAV } from "../../constants/nav";
import SearchDropdown from "./SearchDropdown";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";

export default function Topbar({
  tab,
  user,
  isDirector,
  searchQ,
  setSearchQ,
  searchOpen,
  setSearchOpen,
  searchResults,
  setTab,
  notifOpen,
  setNotifOpen,
  profileOpen,
  setProfileOpen,
  notifItems,
  onMobileMenuOpen,
  onSignOut,
}) {
  const pageTitle = NAV.find((n) => n.id === tab)?.label || "Dashboard";

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-3 sm:px-5 py-3"
      style={{ background: `${C.bg}F2`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}` }}
    >
      {/* Mobile menu trigger */}
      <button className="md:hidden" onClick={onMobileMenuOpen}>
        <Menu size={20} style={{ color: C.text }} />
      </button>

      {/* Page title */}
      <div className="hidden sm:block">
        <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{pageTitle}</div>
      </div>

      {/* Search */}
      <div className="flex-1 relative max-w-md ml-0 sm:ml-4">
        <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.faint }} />
        <input
          value={searchQ}
          onChange={(e) => { setSearchQ(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search products, clients, leads, tickets, team…"
          className="w-full rounded-md pl-8 pr-3 py-2 text-sm outline-none"
          style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text }}
        />
        {searchOpen && searchQ.trim() && (
          <div
            className="absolute top-full mt-1 left-0 right-0 rounded-md overflow-hidden z-40"
            style={{ background: C.panel2, border: `1px solid ${C.border}` }}
          >
            <SearchDropdown
              results={searchResults}
              onSelect={(tabId) => { setTab(tabId); setSearchOpen(false); setSearchQ(""); }}
            />
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
          className="relative p-2 rounded-md"
          style={{ background: C.panel, border: `1px solid ${C.border}` }}
        >
          <Bell size={16} style={{ color: C.text }} />
          {notifItems.length > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center"
              style={{ background: C.red, color: "#fff" }}
            >
              {notifItems.length}
            </span>
          )}
        </button>
        {notifOpen && <NotificationMenu items={notifItems} />}
      </div>

      {/* Profile */}
      <div className="relative hidden sm:block">
        <button
          onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md"
          style={{ background: C.panel, border: `1px solid ${C.border}` }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{ background: C.gold, color: "#0D1117" }}
          >
            {isDirector ? "DR" : "MG"}
          </div>
          <ChevronDown size={13} style={{ color: C.muted }} />
        </button>
        {profileOpen && <ProfileMenu user={user} isDirector={isDirector} onSignOut={onSignOut} />}
      </div>
    </header>
  );
}
