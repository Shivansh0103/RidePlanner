import "./LandingPage.css";

import AltRouteIcon from "@mui/icons-material/AltRoute";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BackpackIcon from "@mui/icons-material/Backpack";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CottageIcon from "@mui/icons-material/Cottage";
import ExploreIcon from "@mui/icons-material/Explore";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SyncIcon from "@mui/icons-material/Sync";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import VerifiedIcon from "@mui/icons-material/Verified";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth";

export default function LandingPage(): React.ReactElement {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activePinTooltip, setActivePinTooltip] = useState(false);

  const handleStartPlanning = () => {
    if (isAuthenticated) {
      navigate("/trips/new");
    } else {
      navigate("/register");
    }
  };

  const handleOpenCockpit = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      const element = document.getElementById("cockpit");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "var(--rp-obsidian-canvas)",
        color: "var(--rp-on-surface)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* 1. TOP NAVIGATION HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "rgba(20, 19, 19, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--rp-border)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.6)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1380px",
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo & Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  boxShadow: "0 0 16px rgba(99, 102, 241, 0.25)",
                }}
              >
                <ExploreIcon sx={{ color: "var(--rp-electric-indigo)", fontSize: 20 }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      color: "var(--rp-primary)",
                      textTransform: "uppercase",
                    }}
                  >
                    RidePlanner
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "9px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(190, 242, 100, 0.12)",
                      color: "var(--rp-acid-green)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      border: "1px solid rgba(190, 242, 100, 0.3)",
                    }}
                  >
                    ALL-IN-ONE
                  </span>
                </div>
              </div>
            </Link>

            {/* Quick Section Nav Links */}
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <a
                href="#features"
                className="font-mono"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--rp-on-surface-variant)",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  transition: "color 0.2s ease, background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--rp-primary)";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--rp-on-surface-variant)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Experience
              </a>
              <a
                href="#cockpit"
                className="font-mono"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--rp-on-surface-variant)",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  transition: "color 0.2s ease, background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--rp-primary)";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--rp-on-surface-variant)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Live Workspace
              </a>
              <a
                href="#travelers"
                className="font-mono"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--rp-on-surface-variant)",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  transition: "color 0.2s ease, background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--rp-primary)";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--rp-on-surface-variant)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Travelers
              </a>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "9999px",
                backgroundColor: "var(--rp-obsidian-base)",
                border: "1px solid var(--rp-border)",
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "inline-flex",
                  width: "8px",
                  height: "8px",
                }}
              >
                <span
                  className="rp-beacon-ring"
                  style={{
                    position: "absolute",
                    display: "inline-flex",
                    height: "100%",
                    width: "100%",
                    borderRadius: "9999px",
                    backgroundColor: "var(--rp-acid-green)",
                    opacity: 0.8,
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    borderRadius: "9999px",
                    height: "8px",
                    width: "8px",
                    backgroundColor: "var(--rp-acid-green)",
                    boxShadow: "0 0 10px var(--rp-acid-green-glow)",
                  }}
                />
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: "10px",
                  color: "var(--rp-on-surface-variant)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Trip Cloud Live
              </span>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="font-mono"
                style={{
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  backgroundColor: "var(--rp-electric-indigo)",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 0 20px var(--rp-electric-indigo-glow)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--rp-electric-indigo-hover)";
                  e.currentTarget.style.boxShadow = "0 0 28px rgba(99, 102, 241, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--rp-electric-indigo)";
                  e.currentTarget.style.boxShadow = "0 0 20px var(--rp-electric-indigo-glow)";
                }}
              >
                <span>Open Cockpit</span>
                <ArrowForwardIcon sx={{ fontSize: 15 }} />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-mono"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--rp-primary)",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    textDecoration: "none",
                    padding: "8px 18px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.5)";
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(99, 102, 241, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span>Sign In</span>
                </Link>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-mono"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    backgroundColor: "var(--rp-electric-indigo)",
                    color: "#ffffff",
                    border: "1px solid rgba(99, 102, 241, 0.5)",
                    cursor: "pointer",
                    boxShadow: "0 0 20px var(--rp-electric-indigo-glow)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--rp-electric-indigo-hover)";
                    e.currentTarget.style.boxShadow = "0 0 28px rgba(99, 102, 241, 0.65)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--rp-electric-indigo)";
                    e.currentTarget.style.boxShadow = "0 0 20px var(--rp-electric-indigo-glow)";
                  }}
                >
                  <span>Start</span>
                  <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. BREATHTAKING IMMERSIVE HERO SECTION */}
      <section
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "130px 24px 70px 24px",
          overflow: "hidden",
        }}
      >
        {/* Background Cinematic Photograph with slow Ken Burns effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <img
            src="/images/hero-coastal.jpg"
            onError={(e) => {
              e.currentTarget.src =
                "https://lh3.googleusercontent.com/aida/AEtjO1UvEfakNWbNfKdeTkteeoHyzRrPRSLXbpOSFKoIuUatCfIRiACMpaoCK-RHjkZwgYsn5yHh4aAKTdbDBtdLS-6yNyuxXmFmV5BsE3VA1cm9A2S8Vz_vrfM65RA3O1gnxpifbKsfguVY5mNbCKC732RG2nQ9IFhCQfGNVwuLd65NzGveF3dQ719RpMY_RUtXSHw9RTIv_kWEVawOxv04aQEUnBsUMSuuTyU1t7LbHuf6dLE4nJidouZAC-0";
            }}
            referrerPolicy="no-referrer"
            alt="Cinematic coastal highway road trip"
            className="rp-ken-burns"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {/* Multi-layered dark obsidian gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, var(--rp-obsidian-canvas) 0%, rgba(20, 19, 19, 0.78) 50%, rgba(20, 19, 19, 0.65) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at center, transparent 20%, rgba(20, 19, 19, 0.45) 60%, var(--rp-obsidian-canvas) 95%)",
            }}
          />
          {/* Ambient drifting glowing orbs in Electric Indigo & Acid Green */}
          <div
            className="rp-gradient-drift-1"
            style={{
              position: "absolute",
              top: "-100px",
              left: "25%",
              width: "500px",
              height: "500px",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 70%)",
              filter: "blur(120px)",
              pointerEvents: "none",
            }}
          />
          <div
            className="rp-gradient-drift-2"
            style={{
              position: "absolute",
              bottom: "-80px",
              right: "25%",
              width: "550px",
              height: "550px",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(190, 242, 100, 0.14) 0%, rgba(99, 102, 241, 0.16) 50%, transparent 70%)",
              filter: "blur(130px)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Hero Foreground Content */}
        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Eyebrow Pill */}
          <div
            className="rp-entry-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(26, 26, 30, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.6)",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                position: "relative",
                display: "inline-flex",
                width: "8px",
                height: "8px",
              }}
            >
              <span
                className="rp-beacon-ring"
                style={{
                  position: "absolute",
                  display: "inline-flex",
                  height: "100%",
                  width: "100%",
                  borderRadius: "9999px",
                  backgroundColor: "var(--rp-acid-green)",
                  opacity: 0.8,
                }}
              />
              <span
                style={{
                  position: "relative",
                  display: "inline-flex",
                  borderRadius: "9999px",
                  height: "8px",
                  width: "8px",
                  backgroundColor: "var(--rp-acid-green)",
                  boxShadow: "0 0 10px var(--rp-acid-green-glow)",
                }}
              />
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--rp-acid-green)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              THE ALL-IN-ONE ROAD TRIP COMPANION
            </span>
          </div>

          {/* Crisp Bold Headline */}
          <h1
            className="rp-entry-2"
            style={{
              fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
              fontSize: "clamp(38px, 6vw, 70px)",
              fontWeight: 800,
              color: "var(--rp-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 20px 0",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.7)",
            }}
          >
            Every Road Trip, <br />
            <span
              style={{
                fontStyle: "italic",
                color: "var(--rp-electric-indigo)",
                fontWeight: 700,
              }}
            >
              Perfectly Orchestrated
            </span>
            .
          </h1>

          {/* Subheadline */}
          <p
            className="rp-entry-3"
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "var(--rp-on-surface)",
              maxWidth: "680px",
              margin: "0 0 34px 0",
              lineHeight: 1.6,
              fontWeight: 400,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            From Himalayan high-altitude passes to coastal highway escapes — your routes, stays,
            fuel, and crew in one seamless hub.
          </p>

          {/* Dual CTAs */}
          <div
            className="rp-entry-4"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              marginBottom: "36px",
            }}
          >
            <button
              type="button"
              onClick={handleStartPlanning}
              className="font-mono"
              style={{
                padding: "14px 30px",
                borderRadius: "12px",
                backgroundColor: "var(--rp-electric-indigo)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 30px var(--rp-electric-indigo-glow)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--rp-electric-indigo-hover)";
                e.currentTarget.style.boxShadow = "0 0 42px rgba(99, 102, 241, 0.65)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--rp-electric-indigo)";
                e.currentTarget.style.boxShadow = "0 0 30px var(--rp-electric-indigo-glow)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span>{isAuthenticated ? "Plan New Expedition" : "Start Planning"}</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>

            <button
              type="button"
              onClick={handleOpenCockpit}
              className="font-mono"
              style={{
                padding: "14px 26px",
                borderRadius: "12px",
                backgroundColor: "rgba(26, 26, 30, 0.85)",
                backdropFilter: "blur(12px)",
                color: "var(--rp-primary)",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--rp-surface-container-high)";
                e.currentTarget.style.borderColor = "var(--rp-electric-indigo)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(26, 26, 30, 0.85)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  backgroundColor: "var(--rp-acid-green)",
                  boxShadow: "0 0 8px var(--rp-acid-green-glow)",
                }}
              />
              <span>Explore Live Demo</span>
              <PlayArrowIcon sx={{ fontSize: 17, color: "var(--rp-on-surface-variant)" }} />
            </button>
          </div>

          {/* Social Proof Pill */}
          <div
            className="rp-entry-5"
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "10px 24px",
              borderRadius: "9999px",
              backgroundColor: "rgba(20, 19, 19, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--rp-border)",
              fontSize: "11px",
              color: "var(--rp-outline)",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--rp-on-surface)",
              }}
            >
              <VerifiedIcon sx={{ fontSize: 15, color: "var(--rp-acid-green)" }} /> 100% Free Start
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--rp-on-surface)",
              }}
            >
              <AltRouteIcon sx={{ fontSize: 15, color: "var(--rp-electric-indigo)" }} /> Multi-Stop &
              Offline Maps
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--rp-on-surface)",
              }}
            >
              <GroupIcon sx={{ fontSize: 15, color: "var(--rp-cyan)" }} /> Real-Time Crew Sync
            </span>
          </div>
        </div>
      </section>

      {/* 3. 3-CARD PHOTO EXPERIENCE GALLERY */}
      <section
        id="features"
        style={{
          width: "100%",
          padding: "70px 24px",
          backgroundColor: "var(--rp-surface-container-low)",
          borderTop: "1px solid var(--rp-border)",
          borderBottom: "1px solid var(--rp-border)",
        }}
      >
        <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  backgroundColor: "var(--rp-surface-container)",
                  border: "1px solid var(--rp-border)",
                  marginBottom: "10px",
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: "10px",
                    color: "var(--rp-acid-green)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  // THE REAL ROAD EXPERIENCE
                </span>
              </div>
              <h2
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "clamp(26px, 3.5vw, 36px)",
                  fontWeight: 800,
                  color: "var(--rp-primary)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Crafted for How You Actually Travel.
              </h2>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "var(--rp-on-surface-variant)",
                maxWidth: "380px",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Zero scattered notes, tabs, or lost chat receipts. Total clarity along every mile.
            </p>
          </div>

          {/* 3 Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Card 1: Mountain Pass Route */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "var(--rp-surface-container)",
                border: "1px solid var(--rp-border)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "var(--rp-electric-indigo)";
                e.currentTarget.style.boxShadow = "0 16px 36px rgba(99, 102, 241, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--rp-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "230px",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/images/feature-mountain.jpg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://lh3.googleusercontent.com/aida/AEtjO1V9N-oF16NPU-xdsMJKD7qVQ_jNFWU_dubkHxrZzZZEzEGp3PYTqv60ahmAqb8PG31vMB3CoYxkxyiYnx2oaIlyl9OpdqxKINcPFktcTyBllj31lXRBPtquO7DrI19ascSt__XEkF9qsBijiVp_7721A_VW6pt7H-Vs-_eV1pPiuB2niPJqh20t-54o8rbcQB6BiTXhoR0eHPoq83dtyv_1qYSWc4bjrOOSzx035ZMsTx0X1wR-2uRZ-FA";
                  }}
                  referrerPolicy="no-referrer"
                  alt="Mountain pass road trip"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, var(--rp-surface-container) 0%, transparent 60%)",
                  }}
                />
                <span
                  className="font-mono"
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(20, 19, 19, 0.85)",
                    backdropFilter: "blur(8px)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--rp-electric-indigo)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <AltRouteIcon sx={{ fontSize: 13 }} /> ROUTING
                </span>
              </div>
              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--rp-primary)",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Smart Routes & Waypoints
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--rp-on-surface-variant)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Drag-and-drop stops with elevation profiles, drive times, and offline topo maps.
                  </p>
                </div>
                <div
                  className="font-mono"
                  style={{
                    paddingTop: "16px",
                    marginTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    color: "var(--rp-electric-indigo)",
                    fontWeight: 700,
                  }}
                >
                  <span>EXPLORE ROUTE TOOLS</span>
                  <ArrowForwardIcon sx={{ fontSize: 13 }} />
                </div>
              </div>
            </div>

            {/* Card 2: Campsite & Fuel Runway */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "var(--rp-surface-container)",
                border: "1px solid var(--rp-border)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "var(--rp-acid-green)";
                e.currentTarget.style.boxShadow = "0 16px 36px rgba(190, 242, 100, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--rp-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "230px",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/images/feature-campsite.jpg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://lh3.googleusercontent.com/aida/AEtjO1XgpjSusuO2l1APMwt0ZvqSsP5Mx5R46sYQpu7ulQ_n_god5xqnWs0ooFpxyPSFMkQpDCfwNaLBWPcQOD9HfB0G3WraYH5Rhcj4_4WxIV6gtnzgfjafGaj6MeVUefyenrDAUJ_s3SgsveSB7sDkxqOHUDLCv00_88PjBQbQmrEaAu_-npo49whVdCtMfjSHXEipAD_K0w7stGNkAUBqv6WrFHA6Lkwgg7X4bCN9UQlKLseEcLbppL529mI";
                  }}
                  referrerPolicy="no-referrer"
                  alt="Campsite under night canyon sky"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, var(--rp-surface-container) 0%, transparent 60%)",
                  }}
                />
                <span
                  className="font-mono"
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(20, 19, 19, 0.85)",
                    backdropFilter: "blur(8px)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--rp-acid-green)",
                    border: "1px solid rgba(190, 242, 100, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <PaymentsIcon sx={{ fontSize: 13 }} /> LOGISTICS
                </span>
              </div>
              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--rp-primary)",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Stays, Camps & Fuel
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--rp-on-surface-variant)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Campsites, hotels, and fuel range math calculated directly against your
                    trajectory.
                  </p>
                </div>
                <div
                  className="font-mono"
                  style={{
                    paddingTop: "16px",
                    marginTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    color: "var(--rp-acid-green)",
                    fontWeight: 700,
                  }}
                >
                  <span>EXPLORE FUEL ENGINE</span>
                  <ArrowForwardIcon sx={{ fontSize: 13 }} />
                </div>
              </div>
            </div>

            {/* Card 3: Gear Packing & Crew Sync */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "var(--rp-surface-container)",
                border: "1px solid var(--rp-border)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "var(--rp-cyan)";
                e.currentTarget.style.boxShadow = "0 16px 36px rgba(6, 182, 212, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--rp-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "230px",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/images/feature-packing.jpg"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://lh3.googleusercontent.com/aida/AEtjO1VhIs_rgV7IgBlxJWh_xvu0jecr_NHDEI5tUadCI62CqFXuPmkoDYKVd-35LapvEc3-ynAHnktGpUpllNXmnt8NHgD5QtywOuaLtqJi-7axUo1Q5xTn8_xFgOhDg170z-XjCVGygygx8nqth-llNB9N85SZy5QOGtbi40FcNHuChQL2NcipGz96I9QZL6mBD8YQznyxBWZEtfoGnKQgEl47axGeWPMG7IzgL7RLUbcqvsdrnW-AgDiMzg8";
                  }}
                  referrerPolicy="no-referrer"
                  alt="Packing motorcycle and adventure gear"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, var(--rp-surface-container) 0%, transparent 60%)",
                  }}
                />
                <span
                  className="font-mono"
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(20, 19, 19, 0.85)",
                    backdropFilter: "blur(8px)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--rp-cyan)",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ChecklistIcon sx={{ fontSize: 13 }} /> PREPARATION
                </span>
              </div>
              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: '"Outfit", sans-serif',
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--rp-primary)",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Gear & Crew Sync
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--rp-on-surface-variant)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Pre-ride vehicle readiness, shared pack lists, and split cost tracking.
                  </p>
                </div>
                <div
                  className="font-mono"
                  style={{
                    paddingTop: "16px",
                    marginTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    color: "var(--rp-cyan)",
                    fontWeight: 700,
                  }}
                >
                  <span>EXPLORE COLLABORATION</span>
                  <ArrowForwardIcon sx={{ fontSize: 13 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPANDED INTERACTIVE WORKSPACE PREVIEW (#cockpit) */}
      <section
        id="cockpit"
        style={{
          width: "100%",
          padding: "80px 24px",
          position: "relative",
          backgroundColor: "var(--rp-obsidian-canvas)",
        }}
      >
        <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
          {/* Section Header with Dynamic Status Badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "28px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    width: "8px",
                    height: "8px",
                  }}
                >
                  <span
                    className="rp-beacon-ring"
                    style={{
                      position: "absolute",
                      display: "inline-flex",
                      height: "100%",
                      width: "100%",
                      borderRadius: "9999px",
                      backgroundColor: "var(--rp-acid-green)",
                      opacity: 0.8,
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      borderRadius: "9999px",
                      height: "8px",
                      width: "8px",
                      backgroundColor: "var(--rp-acid-green)",
                    }}
                  />
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "10px",
                    color: "var(--rp-acid-green)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  // HIGH-ALTITUDE EXPEDITION // SECTOR 04
                </span>
              </div>
              <h2
                style={{
                  fontFamily: '"Outfit", sans-serif',
                  fontSize: "clamp(24px, 3.5vw, 32px)",
                  fontWeight: 800,
                  color: "var(--rp-primary)",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Trans-Himalayan Pass Circuit: Manali to Leh-Ladakh
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: "10px",
                  backgroundColor: "var(--rp-surface-container)",
                  border: "1px solid var(--rp-border)",
                  fontSize: "11px",
                  color: "var(--rp-on-surface)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <WbSunnyIcon sx={{ fontSize: 15, color: "#f59e0b" }} /> 38°F / 3°C Baralacha La
                Pass • Sub-Zero Clear
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(190, 242, 100, 0.1)",
                  border: "1px solid rgba(190, 242, 100, 0.35)",
                  fontSize: "11px",
                  color: "var(--rp-acid-green)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 0 14px rgba(190, 242, 100, 0.12)",
                }}
              >
                <WifiOffIcon sx={{ fontSize: 15 }} /> Offline Satellite Ready • 100% Cached
              </div>
            </div>
          </div>

          {/* Master Workspace Panel Container */}
          <div
            style={{
              width: "100%",
              borderRadius: "24px",
              backgroundColor: "var(--rp-obsidian-base)",
              border: "1px solid var(--rp-border)",
              padding: "32px",
              boxShadow: "0 24px 70px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                gap: "24px",
              }}
            >
              {/* Left Column: Expanded Ladakh Route Map & Telemetry HUD */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "360px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid var(--rp-border)",
                  }}
                >
                  {/* High-Resolution Ladakh Himalayan Mountain Pass Road Trip Photograph */}
                  <img
                    src="/images/ladakh-highway.jpg"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuA5q95j4HmafEqLO0sob0YzVH67oWgtJyAUVleVmLV50u1unOtPH5gc-pJfqk3479mHUdBGZVWn89CL7HSY6FKcW_and-9PGnkBbeLiQCVqq4-6dR4OGvonELyJsjbvF6EOYGQMgXZcma1SrwjWzbnB3OR4MhKM0wwBSX1YEGOeyBEyhv502rpBd9l5FxlwuUv9XdYxR2u_WYKvjQylc8Xj1_EB7SdjR0eVqOF4ec-c432Of3TTXAOU";
                    }}
                    referrerPolicy="no-referrer"
                    alt="Manali-Leh Highway in Ladakh Himalayas with motorcycle road trip"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(20, 19, 19, 0.95) 0%, rgba(20, 19, 19, 0.35) 45%, rgba(0, 0, 0, 0.25) 100%)",
                    }}
                  />

                  {/* Pulsating Waypoint Marker for Nakee La Pass / Baralacha La */}
                  <div
                    style={{
                      position: "absolute",
                      top: "46%",
                      left: "44%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 20,
                      cursor: "pointer",
                    }}
                    onClick={() => setActivePinTooltip(!activePinTooltip)}
                    onMouseEnter={() => setActivePinTooltip(true)}
                    onMouseLeave={() => setActivePinTooltip(false)}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="rp-beacon-pulse"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "9999px",
                          backgroundColor: "var(--rp-acid-green)",
                          border: "2px solid #141313",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 0 16px var(--rp-acid-green)",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "9999px",
                            backgroundColor: "#141313",
                          }}
                        />
                      </span>
                    </div>
                    {/* Tooltip */}
                    <div
                      className="font-mono"
                      style={{
                        position: "absolute",
                        top: "-32px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(20, 19, 19, 0.95)",
                        border: "1px solid var(--rp-acid-green)",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "var(--rp-acid-green)",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.7)",
                        opacity: activePinTooltip ? 1 : 0.85,
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      Waypoint: Baralacha La Summit (16,040 FT)
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        padding: "5px 12px",
                        borderRadius: "9999px",
                        backgroundColor: "rgba(20, 19, 19, 0.9)",
                        backdropFilter: "blur(8px)",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "var(--rp-acid-green)",
                        border: "1px solid rgba(190, 242, 100, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "9999px",
                          backgroundColor: "var(--rp-acid-green)",
                        }}
                      />
                      Day 4: Manali → Leh Highway
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        padding: "5px 12px",
                        borderRadius: "9999px",
                        backgroundColor: "rgba(20, 19, 19, 0.9)",
                        backdropFilter: "blur(8px)",
                        fontSize: "10px",
                        color: "var(--rp-primary)",
                        border: "1px solid var(--rp-border)",
                      }}
                    >
                      Gata Loops Overlook (4,660m • 21 Hairpins)
                    </span>
                  </div>

                  {/* Telemetry Bottom Bar */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      left: "14px",
                      right: "14px",
                      padding: "12px 18px",
                      borderRadius: "14px",
                      backgroundColor: "rgba(20, 19, 19, 0.92)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid var(--rp-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "28px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "9px",
                            color: "var(--rp-outline)",
                            textTransform: "uppercase",
                            display: "block",
                            letterSpacing: "0.06em",
                          }}
                        >
                          TOTAL DISTANCE
                        </span>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "16px",
                            fontWeight: 800,
                            color: "var(--rp-primary)",
                          }}
                        >
                          1,280 km
                        </span>
                      </div>
                      <div>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "9px",
                            color: "var(--rp-outline)",
                            textTransform: "uppercase",
                            display: "block",
                            letterSpacing: "0.06em",
                          }}
                        >
                          FUEL RUNWAY
                        </span>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "16px",
                            fontWeight: 800,
                            color: "var(--rp-electric-indigo)",
                          }}
                        >
                          ₹3,450{" "}
                          <span style={{ fontSize: "10px", color: "var(--rp-outline)" }}>
                            / 185 km reserve
                          </span>
                        </span>
                      </div>
                      <div>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "9px",
                            color: "var(--rp-outline)",
                            textTransform: "uppercase",
                            display: "block",
                            letterSpacing: "0.06em",
                          }}
                        >
                          NEXT PASS
                        </span>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: "var(--rp-primary)",
                          }}
                        >
                          Tanglang La (5,328m)
                        </span>
                      </div>
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        color: "var(--rp-electric-indigo)",
                        fontWeight: 700,
                      }}
                    >
                      <SyncIcon sx={{ fontSize: 15 }} /> Vector Map Sync
                    </div>
                  </div>
                </div>

                {/* Route Overlook Strip */}
                <div
                  style={{
                    padding: "14px 20px",
                    borderRadius: "14px",
                    backgroundColor: "var(--rp-surface-container)",
                    border: "1px solid var(--rp-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <AltRouteIcon sx={{ fontSize: 18, color: "var(--rp-electric-indigo)" }} />
                    <span style={{ color: "var(--rp-on-surface)", fontWeight: 700 }}>
                      Delhi → Chandigarh → Manali → Jispa → Sarchu → Leh
                    </span>
                  </div>
                  <span
                    className="font-mono"
                    style={{
                      color: "var(--rp-acid-green)",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    10 DAYS • 8 HIGH PASSES BOOKED
                  </span>
                </div>
              </div>

              {/* Right Column: Telemetry & Expedition Modules Stack */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Lodging & Campsites Card */}
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "16px",
                    backgroundColor: "var(--rp-surface-container)",
                    border: "1px solid var(--rp-border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "11px",
                        color: "var(--rp-on-surface-variant)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 700,
                      }}
                    >
                      Lodging & High-Altitude Camps
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "10px",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(190, 242, 100, 0.12)",
                        color: "var(--rp-acid-green)",
                        fontWeight: 800,
                        border: "1px solid rgba(190, 242, 100, 0.3)",
                      }}
                    >
                      3 / 3 CONFIRMED
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {/* Stay 1 */}
                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        backgroundColor: "var(--rp-surface-container-low)",
                        border: "1px solid var(--rp-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <CottageIcon sx={{ fontSize: 20, color: "var(--rp-electric-indigo)" }} />
                        <div>
                          <div
                            style={{ fontSize: "13px", color: "var(--rp-primary)", fontWeight: 700 }}
                          >
                            Travellers Nest Camp Sarchu
                          </div>
                          <div
                            className="font-mono"
                            style={{ fontSize: "10px", color: "var(--rp-outline)" }}
                          >
                            Checked In • High-Altitude Swiss Tent (4,400m)
                          </div>
                        </div>
                      </div>
                      <CheckCircleIcon sx={{ fontSize: 18, color: "var(--rp-acid-green)" }} />
                    </div>

                    {/* Stay 2: Active / Current */}
                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        backgroundColor: "var(--rp-surface-container-high)",
                        border: "1px solid rgba(99, 102, 241, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 0 18px rgba(99, 102, 241, 0.15)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <CottageIcon sx={{ fontSize: 20, color: "var(--rp-electric-indigo)" }} />
                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "var(--rp-electric-indigo)",
                              fontWeight: 800,
                            }}
                          >
                            Grand Dragon Leh Homestay
                          </div>
                          <div
                            className="font-mono"
                            style={{ fontSize: "10px", color: "var(--rp-on-surface-variant)" }}
                          >
                            Tonight • Oxygen Cylinder & Campfire OK
                          </div>
                        </div>
                      </div>
                      <span
                        className="font-mono rp-beacon-pulse"
                        style={{
                          fontSize: "9px",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: "var(--rp-electric-indigo)",
                          color: "#ffffff",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        CURRENT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Crew Split & Vehicle Readiness Card */}
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "16px",
                    backgroundColor: "var(--rp-surface-container)",
                    border: "1px solid var(--rp-border)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flex: 1,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "11px",
                          color: "var(--rp-on-surface-variant)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontWeight: 700,
                        }}
                      >
                        Crew Split & Expedition Readiness
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "var(--rp-acid-green)",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "9999px",
                            backgroundColor: "var(--rp-acid-green)",
                          }}
                        />
                        100% READY
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{ fontSize: "22px", fontWeight: 800, color: "var(--rp-primary)" }}
                      >
                        ₹8,500
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: "10px",
                          color: "var(--rp-outline)",
                          textTransform: "uppercase",
                        }}
                      >
                        / RIDER (4 EXPEDITION MEMBERS)
                      </span>
                    </div>

                    {/* Progress Bar Container with Animated Shimmer Light Sweep */}
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        borderRadius: "9999px",
                        backgroundColor: "var(--rp-surface-container-low)",
                        overflow: "hidden",
                        position: "relative",
                        border: "1px solid var(--rp-border)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: "78%",
                          background:
                            "linear-gradient(to right, var(--rp-electric-indigo) 0%, var(--rp-cyan) 60%, var(--rp-acid-green) 100%)",
                          borderRadius: "9999px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          className="rp-shimmer-run"
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: "14px",
                      marginTop: "14px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "var(--rp-outline)",
                    }}
                  >
                    <span>Tyre Pressure, Cold Start & Tool Kit</span>
                    <span
                      style={{
                        color: "var(--rp-acid-green)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 700,
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 15 }} /> Passed (Royal Enfield Himalayan 450)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRAVELER PERSONA STRIP */}
      <section
        id="travelers"
        style={{
          width: "100%",
          padding: "70px 24px",
          backgroundColor: "var(--rp-surface-container-low)",
          borderTop: "1px solid var(--rp-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1380px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: "var(--rp-surface-container)",
              border: "1px solid var(--rp-border)",
              marginBottom: "12px",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "var(--rp-electric-indigo)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              // BUILT FOR EVERY JOURNEY
            </span>
          </div>

          <h2
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 800,
              color: "var(--rp-primary)",
              letterSpacing: "-0.02em",
              margin: "0 0 8px 0",
            }}
          >
            Tailored to the Way You Roam.
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--rp-on-surface-variant)",
              maxWidth: "560px",
              margin: "0 0 36px 0",
              lineHeight: 1.5,
            }}
          >
            One unified framework whether tackling mountain hairpins solo or cruising cross-country
            with friends.
          </p>

          {/* 4 Cards Grid */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Solo Adventurers */}
            <div
              style={{
                padding: "18px",
                borderRadius: "14px",
                backgroundColor: "var(--rp-surface-container)",
                border: "1px solid var(--rp-border)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--rp-acid-green)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--rp-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(190, 242, 100, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--rp-acid-green)",
                  flexShrink: 0,
                  border: "1px solid rgba(190, 242, 100, 0.25)",
                }}
              >
                <BackpackIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--rp-primary)" }}>
                  Solo Adventurers
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: "10px", color: "var(--rp-on-surface-variant)" }}
                >
                  Offline topo & range safety
                </div>
              </div>
            </div>

            {/* Weekend Explorers */}
            <div
              style={{
                padding: "18px",
                borderRadius: "14px",
                backgroundColor: "var(--rp-surface-container)",
                border: "1px solid var(--rp-border)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--rp-electric-indigo)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--rp-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(99, 102, 241, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--rp-electric-indigo)",
                  flexShrink: 0,
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                }}
              >
                <FamilyRestroomIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--rp-primary)" }}>
                  Weekend Explorers
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: "10px", color: "var(--rp-on-surface-variant)" }}
                >
                  Paced stops & stay sync
                </div>
              </div>
            </div>

            {/* Motorcycles & Cars */}
            <div
              style={{
                padding: "18px",
                borderRadius: "14px",
                backgroundColor: "var(--rp-surface-container)",
                border: "1px solid var(--rp-border)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--rp-cyan)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--rp-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(6, 182, 212, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--rp-cyan)",
                  flexShrink: 0,
                  border: "1px solid rgba(6, 182, 212, 0.25)",
                }}
              >
                <TwoWheelerIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--rp-primary)" }}>
                  Motorcycles & 4x4
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: "10px", color: "var(--rp-on-surface-variant)" }}
                >
                  Curated curves & mountain climbs
                </div>
              </div>
            </div>

            {/* Group Road Clubs */}
            <div
              style={{
                padding: "18px",
                borderRadius: "14px",
                backgroundColor: "var(--rp-surface-container)",
                border: "1px solid var(--rp-border)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--rp-electric-indigo)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--rp-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(99, 102, 241, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--rp-electric-indigo)",
                  flexShrink: 0,
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                }}
              >
                <GroupsIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--rp-primary)" }}>
                  Group Road Clubs
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: "10px", color: "var(--rp-on-surface-variant)" }}
                >
                  Real-time split & parity
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM HIGH-CONVERSION CTA */}
      <section
        style={{
          width: "100%",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--rp-obsidian-canvas)",
        }}
      >
        {/* Glow backdrop */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "550px",
            height: "220px",
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(190, 242, 100, 0.1) 60%, transparent 80%)",
            filter: "blur(110px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            borderRadius: "24px",
            backgroundColor: "var(--rp-obsidian-base)",
            border: "1px solid var(--rp-border)",
            padding: "54px 36px",
            textAlign: "center",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: "var(--rp-surface-container)",
              border: "1px solid var(--rp-border)",
              color: "var(--rp-acid-green)",
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "9999px",
                backgroundColor: "var(--rp-acid-green)",
              }}
            />
            <span
              className="font-mono"
              style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}
            >
              ZERO SETUP REQUIRED
            </span>
          </div>

          <h2
            style={{
              fontFamily: '"Outfit", sans-serif',
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "var(--rp-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              margin: "0 0 14px 0",
            }}
          >
            Ready to Hit the Open Road?
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--rp-on-surface-variant)",
              maxWidth: "520px",
              margin: "0 auto 34px auto",
              lineHeight: 1.6,
            }}
          >
            Join thousands of travelers orchestrating effortless journeys without the app sprawl.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
            }}
          >
            <button
              type="button"
              onClick={handleStartPlanning}
              className="font-mono"
              style={{
                padding: "14px 32px",
                borderRadius: "12px",
                backgroundColor: "var(--rp-electric-indigo)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 30px var(--rp-electric-indigo-glow)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--rp-electric-indigo-hover)";
                e.currentTarget.style.boxShadow = "0 0 42px rgba(99, 102, 241, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--rp-electric-indigo)";
                e.currentTarget.style.boxShadow = "0 0 30px var(--rp-electric-indigo-glow)";
              }}
            >
              <span>{isAuthenticated ? "Launch Console" : "Create Free Account"}</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>

            <button
              type="button"
              onClick={handleOpenCockpit}
              className="font-mono"
              style={{
                padding: "14px 26px",
                borderRadius: "12px",
                backgroundColor: "var(--rp-surface-container)",
                border: "1px solid var(--rp-border)",
                color: "var(--rp-primary)",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--rp-surface-container-high)";
                e.currentTarget.style.borderColor = "var(--rp-electric-indigo)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--rp-surface-container)";
                e.currentTarget.style.borderColor = "var(--rp-border)";
              }}
            >
              <span>View Sample Expedition</span>
              <ExploreIcon sx={{ fontSize: 16, color: "var(--rp-electric-indigo)" }} />
            </button>
          </div>
        </div>
      </section>

      {/* 7. CLEAN MINIMAL FOOTER */}
      <footer
        style={{
          width: "100%",
          backgroundColor: "var(--rp-obsidian-canvas)",
          borderTop: "1px solid var(--rp-border)",
          padding: "32px 24px",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "1380px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            className="font-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "11px",
              color: "var(--rp-outline)",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                backgroundColor: "rgba(99, 102, 241, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--rp-electric-indigo)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            >
              <ExploreIcon sx={{ fontSize: 14 }} />
            </div>
            <span
              style={{
                fontWeight: 800,
                color: "var(--rp-primary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              RidePlanner
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
            <span>© {new Date().getFullYear()} ALL RIGHTS RESERVED</span>
          </div>

          <div
            className="font-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "11px",
            }}
          >
            <a
              href="#features"
              style={{
                color: "var(--rp-outline)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--rp-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--rp-outline)";
              }}
            >
              Features
            </a>
            <a
              href="#cockpit"
              style={{
                color: "var(--rp-outline)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--rp-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--rp-outline)";
              }}
            >
              Expedition Console
            </a>
            <Link
              to="/login"
              style={{
                color: "var(--rp-outline)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--rp-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--rp-outline)";
              }}
            >
              Rider Sign-In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
