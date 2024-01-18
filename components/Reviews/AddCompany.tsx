import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { number, object, string, z } from "zod";
import { regions } from "../common/constant/Regions";
import { uploadIpfsData } from "../common/utils/Ipfs";
import { addNewCompany } from "../common/utils/SmartContract";
import Form, { useZodForm } from "../Form/Form";
import { InputTextField, SelectField } from "../FormFields";
import { UploadField } from "../FormFields/UploadField";
import { GridItemSix, GridLayout } from "../Layout/GridLayout";

interface AddCompanyProps {
  setIsReloadData: Dispatch<SetStateAction<boolean>>;
}

const listTypeCom = [
  {
    label: "Outsourcing",
    value: "Outsourcing",
  },

  {
    label: "Product",
    value: "Product",
  },
];

const AddCompany: React.FunctionComponent<AddCompanyProps> = ({
  setIsReloadData,
}) => {
  const [isShowFormAddCompany, setIsShowAddCompany] = useState<boolean>(false);
  const { address } = useAccount();
  const [addressInfo, setAddressInfo] = useState("");

  const [image, setImage] = useState<File | any>();
  const [createObjectURL, setCreateObjectURL] = useState<any>(null);

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  useEffect(() => {
    if (address) setAddressInfo(address);
  }, [address]);

  const newCompanySchema = object({
    nameCom: string()
      .min(1, "Company name is required")
      .max(50, "Company name is limited to 50 characters")
      .refine(
        async (val) => val.trim().split(" ").length <= 10,
        "Company name is limited to 5 words"
      ),
    address: string()
      .min(1, "Address is required")
      .max(50, "Company Address is limited to 50 characters")
      .refine(
        async (val) => val.trim().split(" ").length <= 15,
        "Address is limited to 15 words"
      ),
    type: string(),
    numMember: string()
      .min(1, "Number of personnel is required")
      .refine(
        (val) => Number(val) > 0,
        "Number of personnel must be greater than 0 employees"
      )
      .refine(
        (val) => Number(val) < 1000000,
        "Number of personnel must be less than 1000000 employees"
      ),
    regions: string(),
    image: z.any().refine((files) => {
      return files.length > 0;
    }, `Image field is required`),
  });

  const form = useZodForm({
    schema: newCompanySchema,
  });

  const onSubmit = async (value: any) => {
    const imgHash = await uploadIpfsData(value.image[0], true);
    const resDt = await uploadIpfsData({
      ...value,
      imageHash: imgHash,
      image: image.name,
    });
    await addNewCompany(resDt, value.nameCom, addressInfo);
    setIsShowAddCompany(!isShowFormAddCompany);
    setIsReloadData(true);
    form.reset();
  };

  return (
    <>
      <button
        onClick={() => {
          setIsShowAddCompany((prev) => !prev);
        }}
        className="px-4 py-3 bg-[#28a745] border-[#28a745] text-white hover:bg-[#28a765] text-[16px] mb-[20px]"
      >
        {isShowFormAddCompany ? "Shorten" : "Add new company"}
      </button>

      {isShowFormAddCompany && (
        <GridLayout>
          <GridItemSix>
            <Form form={form} onSubmit={onSubmit}>
              <InputTextField
                label="Company name"
                className="px-3 py-2 bg-white"
                placeholder="Enter company name"
                {...form.register("nameCom")}
              />

              <InputTextField
                label="Company address"
                className="px-3 py-2 bg-white"
                placeholder="Enter company address"
                {...form.register("address")}
              />

              <SelectField
                options={listTypeCom}
                label="Type of company"
                {...form.register("type")}
              />

              <InputTextField
                label="Number of personnel"
                className="px-3 py-2 bg-white"
                placeholder="Enter number of personnel"
                inputType="number"
                {...form.register("numMember")}
              />

              <UploadField
                label={"Company image"}
                {...form.register("image")}
                onChange={uploadToClient}
              />

              <SelectField
                options={regions}
                label="Country"
                {...form.register("regions")}
              />

              <button
                type="submit"
                className="w-[45%] px-3 py-3 mt-[10px] bg-[#28a745] border-[#28a745] text-white hover:bg-[#28a765] text-[16px] mb-8"
              >
                Submit company
              </button>
            </Form>
          </GridItemSix>
        </GridLayout>
      )}
    </>
  );
};

export default AddCompany;
