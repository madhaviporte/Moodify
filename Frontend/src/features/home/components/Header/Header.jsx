import React, { useState } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import "./Header.scss";

const Header = ({ onMenuToggle }) => {
  const { user, handleLogout } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="header">
      {/* Mobile menu button */}
      <button className="header__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Search bar */}
      <div className={`header__search ${searchFocused ? "header__search--focused" : ""}`}>
        <svg className="header__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search songs, moods, artists..."
          className="header__search-input"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right section */}
      <div className="header__right">
        <button className="header__icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="header__avatar" title={user?.username || "User"}>
          {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </header>
  );
};

export default Header;
