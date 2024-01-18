import CogIcon from "@heroicons/react/solid/CogIcon";
import GlobeIcon from "@heroicons/react/solid/GlobeIcon";
import LocationMarkerIcon from "@heroicons/react/solid/LocationMarkerIcon";
import StarIcon from "@heroicons/react/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import nfq from "../../assets/images/nfq_logo.png";

interface CompanyCardProps {
  widthImg?: number;
  heightImg?: number;
  className?: string;
  isDetail?: boolean;
  info?: any;
  countCmt?: number;
  hash?: string;
}

const subdomain = process.env.NEXT_PUBLIC_INFURA_GATEWAY_SUBDOMAIN;

const CompanyCard: React.FunctionComponent<CompanyCardProps> = ({
  widthImg = 80,
  heightImg = 80,
  className,
  isDetail = false,
  info,
  countCmt,
  hash,
}) => {
  const router = useRouter();

  const convert = (value: string) => {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    if (value) return regionNames.of(value);
  };

  const handleNavigate = () => {
    !isDetail && router.push(`/reviews/${hash}`);
  };

  return (
    <>
      <div
        className={`flex mb-2 ${className} cursor-pointer`}
        onClick={handleNavigate}
      >
        {info.imageHash ? (
          <div
            className="company__img-container"
            style={{ width: widthImg, height: heightImg }}
          >
            <picture>
              <img src={`${subdomain}/ipfs/${info.imageHash}`} alt="" />
            </picture>
          </div>
        ) : (
          <div>
            <Image
              src={nfq}
              objectFit="contain"
              width={widthImg}
              height={heightImg}
              alt=""
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className={clsx("text-2xl", isDetail)}>{info?.nameCom}</div>
          <div
            className={clsx("flex gap-2", {
              "flex-col": isDetail,
            })}
          >
            <div className="flex items-center gap-1">
              <LocationMarkerIcon className="w-4 h-4" />
              <div>{info?.address}</div>
            </div>
            <div className="flex items-center gap-1">
              <CogIcon className="w-4 h-4" />
              <div>{info?.type}</div>
            </div>
            <div className="flex items-center gap-1">
              <UserGroupIcon className="w-4 h-4" />
              <div>{info?.numMember}</div>
            </div>
            <div className="flex items-center gap-1">
              <GlobeIcon className="w-4 h-4 font-bold" />
              <div>{convert(info?.regions)}</div>
            </div>
          </div>
          {!isDetail && (
            <div className="flex">
              <StarIcon className="w-5 h-5 text-[#d2691e]" />
              <p className="text-[#d2691e]">
                <Link href={`/reviews/${info.nameCom}`}>
                  <a>Review ({countCmt})</a>
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyCard;
