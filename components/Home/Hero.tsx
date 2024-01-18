import Link from "next/link";
import React from "react";

interface HeroProps {}

const Hero: React.FunctionComponent<HeroProps> = (props) => {
  return (
    <>
      <div id="section-info" className=" pt-[20px] px-[21px]">
        <p className="shadow-sm px-5 py-3 bg-info border border-info-secondary text-info-primary">
          1. Admin has just added a feature to view 1 review and filter by
          company type and address.
          <br />
          2. Beginning today, Admin will display{" "}
          <Link href={"/forums/tamsudev"}>
            <span className="text-[#4d90fc] cursor-pointer hover:underline">
              Reviews
            </span>
          </Link>
          ; feel free to leave as many as you like.
          <br />
          3. Do not say &quot;at the fish market&ldquo; Devs, as Dev is looking
          for a location and does not wish to stand there!
          <br />
          4. Since some ISPs ban access to tamsudev.com, you can visit
          tamsudev.club, use the Tor browser, or connect through a VPN.
        </p>
      </div>
    </>
  );
};

export default Hero;
