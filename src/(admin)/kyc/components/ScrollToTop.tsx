import { useEffect } from "react";

type ScrollToTopProps = {
  trigger: any;
};

const ScrollToTop = ({ trigger }: ScrollToTopProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [trigger]);

  return null;
};

export default ScrollToTop;
