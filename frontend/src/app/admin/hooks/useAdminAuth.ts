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



  return {
    authorized,
    handleManualLogout
  };
}
