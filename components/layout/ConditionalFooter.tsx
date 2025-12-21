"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();
  const isRevealPage = pathname?.startsWith("/reveal");

  if (isRevealPage) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
