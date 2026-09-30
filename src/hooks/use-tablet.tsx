import * as React from "react";

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState(false);
  React.useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isTablet;
}