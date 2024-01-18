import Link from "next/link";
import React, { Children, ReactNode } from "react";
import Hero from "../Home/Hero";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout: React.FunctionComponent<SiteLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="min-h-screen mx-auto container max-w-[1140px]">
        <Hero />
        <div className="px-[21px]">{children}</div>
        <footer className="mb-5">
          © 2017 tamsudev.com. All Rights Reserved |{" "}
          <Link href="#">
            <a className="text-[#4d90fc]">Terms of Use</a>
          </Link>{" "}
          |{" "}
          <Link href="#">
            <a className="text-[#4d90fc]">FAQ</a>
          </Link>
        </footer>
      </div>
    </>
  );
};

export default SiteLayout;
