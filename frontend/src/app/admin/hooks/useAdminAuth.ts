import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [authorized, setAuthorized] = useState<boolean>(false);

  const handleAutoLogout = (msg: string) => {
    localStorage.removeItem("adminSession");
    localStorage.removeItem("lastActivityTime");
    window.location.href = "/login?expired=true";
  };

  const handleManualLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("adminSession");
    localStorage.removeItem("lastActivityTime");
    window.location.href = "/login";
  };

  // Auth checking on mount
  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    const lastActivity = localStorage.getItem("lastActivityTime");
    const thirtyMinutes = 30 * 60 * 1000; // 1800000 ms

    if (!session || session !== "true") {
      window.location.href = "/login";
      return;
    }

    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10);
      if (elapsed > thirtyMinutes) {
        handleAutoLogout("Your session has expired due to 30 minutes of inactivity.");
        return;
      }
    }

    setAuthorized(true);
    localStorage.setItem("lastActivityTime", Date.now().toString());
  }, []);

  // Inactivity tracking listeners
  useEffect(() => {
    if (!authorized) return;

    const resetTimer = () => {
      localStorage.setItem("lastActivityTime", Date.now().toString());
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    const checkInterval = setInterval(() => {
      const lastActivity = localStorage.getItem("lastActivityTime");
      const thirtyMinutes = 30 * 60 * 1000;
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed > thirtyMinutes) {
          handleAutoLogout("You have been logged out automatically due to 30 minutes of inactivity.");
        }
      }
    }, 10000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(checkInterval);
    };
  }, [authorized]);

  return {
    authorized,
    handleManualLogout
  };
}
