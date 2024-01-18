import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CompanyInfo } from "../../models/companyInfo";
import { getDataIpfs } from "../common/utils/Ipfs";
import { getArrCompany } from "../common/utils/SmartContract";
import { InputTextField } from "../FormFields";
import CheckBox from "../FormFields/CheckBox";
import SelectField from "../FormFields/SelectField";

interface FilterProps {
  setFilterComs: Dispatch<SetStateAction<CompanyInfo[] | null>>;
}

const listAddress = [
  { label: "---- Address ----", value: "" },
  { label: "Ho Chi Minh", value: "Ho Chi Minh" },
  { label: "Ha Noi", value: "Ha Noi" },
  { label: "Da Nang", value: "Da Nang" },
];

const Filter: React.FunctionComponent<FilterProps> = ({ setFilterComs }) => {
  const [arrCom, setArrCom] = useState<CompanyInfo[]>();
  const [arrComData, setArrComData] = useState<any[]>();
  const [arrComEnb, setArrComEnb] = useState<CompanyInfo[]>();
  const [isProductChecked, setIsProductChecked] = useState(false);
  const [isOutsourceChecked, setIsOutsourceChecked] = useState(false);
  const [addressSelected, setAddressSelected] = useState<string | null>(null);
  const router = useRouter();
  const { address } = useAccount();
  const [accountWallet, setAccountWallet] = useState<any>({});

  const handleChange = async (value: string) => {
    if (arrCom) {
      let newArr: any = [];
      for (const i of arrCom) {
        if (i.name.toLowerCase().includes(value.toLowerCase())) {
          newArr.push(i);
        }
      }
      setArrComEnb(newArr);
    }
    if (value === "") setArrComEnb(undefined);
  };

  useEffect(() => {
    getArrComData();
  }, [arrCom]);

  const getArrComData = async () => {
    if (arrCom) {
      const arrHash = arrCom.map((e) => e.companyHash);
      const resDt = await getDataIpfs(arrHash);
      resDt && setArrComData(resDt);
    }
  };

  const reloadArrComData = async () => {
    const arrCompany = await getArrCompany();
    setArrCom(arrCompany);
  };

  // Implement search filter
  const handleSelect = (comHash: string) => {
    router.push(`/reviews/${comHash}`);
  };

  const handleSelectAddress = async (value: string) => {
    setAddressSelected(value);
  };

  // Implement select filter (select type and select address)
  useEffect(() => {
    accountWallet.address && reloadArrComData();
  }, [
    accountWallet.address,
    addressSelected,
    isProductChecked,
    isOutsourceChecked,
  ]);

  useEffect(() => {
    if (arrComData) {
      let newArr = arrComData.filter((e) =>
        addressSelected !== null && addressSelected !== ""
          ? e.address.includes(addressSelected)
          : true
      );

      if (isProductChecked && !isOutsourceChecked) {
        newArr = newArr.filter((e) => e.type === "Product");
        setFilterComs(newArr.map((e) => e.ipfsHash));
      } else if (!isProductChecked && isOutsourceChecked) {
        newArr = newArr.filter((e) => e.type === "Outsourcing");
        setFilterComs(newArr.map((e) => e.ipfsHash));
      } else {
        setFilterComs(newArr.map((e) => e.ipfsHash));
      }
    }
  }, [arrComData]);

  useEffect(() => {
    setAccountWallet({ address: address });
  }, [address]);

  return (
    <>
      <div className="review-filter">
        <p className="slogan">
          &#123; Dev establish a foothold and keep it! &#125;
        </p>

        <div className="input-container">
          <InputTextField
            type="text"
            placeholder="Search by company name"
            className="px-3 py-2 bg-white"
            onChange={(e) => handleChange(e.target.value)}
          />
          {arrComEnb && (
            <div className="option-list">
              {arrComEnb &&
                arrComEnb.map((e, i) => (
                  <>
                    <div
                      key={i}
                      className="option-card"
                      onClick={() => handleSelect(e.companyHash)}
                    >
                      {e.name}
                    </div>
                  </>
                ))}
            </div>
          )}
        </div>

        <div className="flex gap-8 mt-[10px]">
          <div className="flex-auto">
            <SelectField onSelect={handleSelectAddress} options={listAddress} />
          </div>
          <div className="flex-auto flex gap-8">
            <CheckBox onChange={(e) => setIsProductChecked(e)} name="Product" />
            <CheckBox
              onChange={(e) => setIsOutsourceChecked(e)}
              name="Outsourcing"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
