"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Routes where footer should be HIDDEN
  const hiddenRoutes = ["/reveal", "/donate"];
  
  // Exception: Show footer on the success page
  const isSuccessPage = pathname === "/donate/checkout/success";
  
  const shouldHide = hiddenRoutes.some(route => pathname?.startsWith(route)) && !isSuccessPage;

  if (shouldHide) {
    return null;
  }

  return <Footer />;
};

export default ConditionalFooter;
