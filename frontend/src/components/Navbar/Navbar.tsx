"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check for user session
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        console.error("Error parsing userSession:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setCurrentUser(null);
    setShowProfileDropdown(false);
    window.location.reload();
  };

  return (
    <header className={styles.header}>
      <div className={styles.navLeft}>
        <button className={styles.hamburgerIcon} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <Link href="/" aria-label="Home" className={styles.logo}>
          29sFORMULA
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.activeLink : ""}`}>HOME</Link>
          <Link href="/shop" className={`${styles.navLink} ${pathname === "/shop" ? styles.activeLink : ""}`}>SHOP ALL</Link>
          <Link href="/collections" className={`${styles.navLink} ${pathname === "/collections" ? styles.activeLink : ""}`}>COLLECTIONS</Link>
          <Link href="/track" className={`${styles.navLink} ${pathname === "/track" ? styles.activeLink : ""}`}>TRACK ORDER</Link>
        </nav>
        {isMobileMenuOpen && (
          <nav className={styles.mobileMenu}>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.navLink} ${pathname === "/" ? styles.activeLink : ""}`}>HOME</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.navLink} ${pathname === "/shop" ? styles.activeLink : ""}`}>SHOP ALL</Link>
            <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.navLink} ${pathname === "/collections" ? styles.activeLink : ""}`}>COLLECTIONS</Link>
            <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.navLink} ${pathname === "/track" ? styles.activeLink : ""}`}>TRACK ORDER</Link>
          </nav>
        )}
      </div>
      
      <div className={styles.navRight}>
        <Link href="/shop" aria-label="Search" className={styles.iconBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={styles.navIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
          </svg>
        </Link>
        {currentUser ? (
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => setShowProfileDropdown(prev => !prev)} 
              style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                backgroundColor: "#ffffff", 
                color: "#000000", 
                border: "none", 
                fontSize: "0.85rem", 
                fontWeight: 700, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                textTransform: "uppercase" 
              }}
              title={currentUser.name}
            >
              {currentUser.name.charAt(0)}
            </button>
            
            {showProfileDropdown && (
              <div style={{ 
                position: "absolute", 
                top: "40px", 
                right: 0, 
                backgroundColor: "#ffffff", 
                border: "1px solid #eaeaea", 
                borderRadius: "6px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)", 
                padding: "15px", 
                zIndex: 1000, 
                minWidth: "180px", 
                textAlign: "left" 
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>{currentUser.name}</p>
                <p style={{ margin: "0 0 12px 0", fontSize: "0.75rem", color: "#6b7280", wordBreak: "break-all" }}>{currentUser.email}</p>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    backgroundColor: "#000", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "4px", 
                    fontSize: "0.75rem", 
                    fontWeight: 700, 
                    cursor: "pointer" 
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" aria-label="Account" className={styles.iconBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.navIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </Link>
        )}
        <button aria-label="Cart" className={styles.iconBtn} onClick={onCartClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={styles.navIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
