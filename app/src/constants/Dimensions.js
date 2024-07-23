import { useState, useEffect } from "react";

export function useDimentions() {
  let [dimentions, setDimentions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let eventListener = () => {
      setDimentions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", eventListener);

    return () => {
      window.removeEventListener("resize", eventListener);
    };
  }, []);

  return dimentions;
}
