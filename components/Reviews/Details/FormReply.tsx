import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { object, string } from "zod";
import AlertModal from "../../../modals/AlertModal";
import { currentDateTime } from "../../common/utils/DateTime";
import { uploadIpfsData } from "../../common/utils/Ipfs";
import { addNewRepComment } from "../../common/utils/SmartContract";
import Form, { useZodForm } from "../../Form/Form";
import { InputTextField, SelectField } from "../../FormFields";

interface FormReplyProps {
  ipfsHash: string;
  setShow: any;
  setIsReplied: (value: boolean) => void;
}

const optionsPresence = [
  { label: "Select", value: "" },
  { label: "Approve", value: "Approve" },
  { label: "Bullshit", value: "Bullshit" },
  { label: "I don't care", value: "I don't care" },
  { label: "Please delete", value: "Please delete" },
];

const FormReply: React.FunctionComponent<FormReplyProps> = ({
  ipfsHash,
  setShow,
  setIsReplied,
}) => {
  const { address } = useAccount();
  const [isModalCmtOpen, setIsModalCmtOpen] = useState<boolean | string>(false);
  const newReplySchema = object({
    name: string().max(50, "Your name is limited to 50 characters"),
    presence: string(),
    reply: string().refine(
      (value) => value.trim().split(" ").length >= 10,
      "Reply is required and at least 10 words"
    ),
  });

  const [addressInfo, setAddressInfo] = useState("");

  useEffect(() => {
    if (address) setAddressInfo(address);
  }, [address]);

  const form = useZodForm({
    schema: newReplySchema,
  });

  const submit = async (value: any) => {
    value = { ...value, dateTime: currentDateTime() };
    await sendDataInfura(value, ipfsHash);
    form.reset();
  };

  const sendDataInfura = async (data: any, cid: string) => {
    const res = await uploadIpfsData(data);
    if (res) {
      const addNewRes = await addNewRepComment(res, cid, addressInfo);

      switch (addNewRes) {
        case "INSUFFICIENT_FUNDS":
          setIsModalCmtOpen("INSUFFICIENT_FUNDS");
          return;

        case "ACTION_REJECTED":
          setIsModalCmtOpen("ACTION_REJECTED");
          return;
      }
      setShow(false);
      setIsReplied(true);
    }
  };

  return (
    <>
      <Form form={form} onSubmit={submit}>
        <InputTextField
          label="Your name"
          className="px-3 py-2 bg-white"
          placeholder="Even if the name is false, enter it."
          {...form.register("name")}
        />
        <SelectField
          options={optionsPresence}
          label="Behaviour"
          {...form.register("presence")}
        />
        <InputTextField
          className="px-3 py-2 bg-white"
          label="Reply"
          placeholder="Please refrain"
          {...form.register("reply")}
        />
        <button
          type="submit"
          className="w-[27%] px-3 py-3 mt-[10px] bg-[#28a745] border-[#28a745] text-white hover:bg-[#28a765] text-[16px]"
        >
          Send review
        </button>
      </Form>

      <AlertModal
        open={isModalCmtOpen ? true : false}
        setOpen={setIsModalCmtOpen}
        title={
          isModalCmtOpen == "ACTION_REJECTED"
            ? "User denied transaction signature"
            : "Insuffecient funds"
        }
      />
    </>
  );
};

export default FormReply;
