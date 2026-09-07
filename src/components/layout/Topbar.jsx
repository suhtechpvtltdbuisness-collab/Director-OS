import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { C, FONT_DISPLAY } from "../../constants/theme";
import { NAV_ITEMS } from "../../constants/nav";
import useGlobalSearch from "../../hooks/useGlobalSearch";
import SearchDropdown from "./SearchDropdown";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";

function useCurrentTitle() {
  const { pathname } = useLocation();
  const match = NAV_ITEMS
    .filter((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return match?.label || "Director OS";
}

export default function Topbar({ user, isDirector, notifItems, onMobileMenuOpen, onSignOut }) {
  const navigate = useNavigate();
  const title = useCurrentTitle();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const results = useGlobalSearch(query);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); setNotifOpen(false); setProfileOpen(false); }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    const onClick = (e) => { if (!searchRef.current?.parentElement?.contains(e.target)) setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);

  function go(to) {
    navigate(to);
    setOpen(false);
    setQuery("");
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-3 sm:px-5 py-3"
      style={{ background: `${C.bg}F2`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.border}` }}
    >
      <button className="md:hidden" onClick={onMobileMenuOpen} aria-label="Open navigation">
        <Menu size={20} style={{ color: C.text }} />
      </button>

      <div className="hidden lg:block shrink-0">
        <div className="text-sm font-semibold" style={{ fontFamily: FONT_DISPLAY }}>{title}</div>
      </div>

      <div className="flex-1 relative max-w-md lg:ml-4">
        <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: C.faint }} />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search clients, projects, leads, tickets…"
          className="w-full rounded-md pl-8 pr-8 py-2 text-sm outline-none"
          style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text }}
        />
        <kbd
          className="hidden sm:block absolute right-2 top-2 text-[10px] px-1.5 py-0.5 rounded"
          style={{ background: C.track, color: C.faint }}
        >
          /
        </kbd>
        {open && query.trim() && (
          <div
            className="absolute top-full mt-1 left-0 right-0 rounded-md overflow-hidden z-40 shadow-xl"
            style={{ background: C.panel2, border: `1px solid ${C.border}` }}
          >
            <SearchDropdown results={results} onSelect={go} />
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
          className="relative p-2 rounded-md"
          style={{ background: C.panel, border: `1px solid ${C.border}` }}
          aria-label="Notifications"
        >
          <Bell size={16} style={{ color: C.text }} />
          {notifItems.length > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[9px] flex items-center justify-center font-semibold"
              style={{ background: C.red, color: "#fff" }}
            >
              {notifItems.length}
            </span>
          )}
        </button>
        {notifOpen && <NotificationMenu items={notifItems} onClose={() => setNotifOpen(false)} />}
      </div>

      <div className="relative hidden sm:block">
        <button
          onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md"
          style={{ background: C.panel, border: `1px solid ${C.border}` }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
            style={{ background: C.gold, color: C.bg }}
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
