import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { object, string } from "zod";
import AlertModal from "../../../modals/AlertModal";
import { currentDateTime } from "../../common/utils/DateTime";
import { getDataIpfs, uploadIpfsData } from "../../common/utils/Ipfs";
import {
  addNewComment,
  addNewCommentHistory,
  getArrComment,
  getCompanyHash,
} from "../../common/utils/SmartContract";
import Form, { useZodForm } from "../../Form/Form";
import { InputTextField, SelectField } from "../../FormFields";
import { TextArea } from "../../FormFields/TextArea";
import CompanyCard from "../../Home/CompanyCard";
import { GridItemSix, GridLayout } from "../../Layout/GridLayout";
import CommentReviewer from "./CommentReviewer";

const listSalary = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "Fantasy",
    value: "Fantasy",
  },
  {
    label: "High",
    value: "High",
  },
  {
    label: "Delicious",
    value: "Delicious",
  },
  {
    label: "Low",
    value: "Low",
  },
  {
    label: "Very low",
    value: "Very low",
  },
];

const listEvaluate = [
  {
    label: "Poor",
    value: "Poor",
  },
  {
    label: "Mediocre",
    value: "Mediocre",
  },
  {
    label: "Usually",
    value: "Usually",
  },
  {
    label: "Good",
    value: "Good",
  },
  {
    label: "Delicious",
    value: "Delicious",
  },
];

interface ReviewDetailsProps {
  title?: string;
  comInfo?: any;
  info?: any;
  setIsReload?: Dispatch<SetStateAction<boolean>>;
  isReload?: boolean;
}

const ReviewDetails: React.FunctionComponent<ReviewDetailsProps> = ({
  title,
  comInfo,
  info,
  setIsReload,
  isReload,
}) => {
  const [isShowFormReview, setIsFormReview] = useState<boolean>(false);
  const router = useRouter();
  const { nameCompany } = router.query;

  const [dataComment, setDataComment] = useState<any>();
  const [isGetData, setIsGetData] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<any>({});
  const { address } = useAccount();
  const [addressInfo, setAddressInfo] = useState("");
  const [isModalCmtOpen, setIsModalCmtOpen] = useState<boolean | string>(false);

  useEffect(() => {
    if (address) setAddressInfo(address);
  }, [address]);

  const newReviewSchema = object({
    name: string().max(50, "Your name is limited to 50 characters"),
    position: string().max(50, "Your name is limited to 50 characters"),
    salary: string(),
    evaluate: string(),
    comment: string().refine(
      async (val) => val.trim().split(" ").length >= 10,
      "Comment is required and at least 10 words"
    ),
  });
  const form = useZodForm({
    schema: newReviewSchema,
  });

  useEffect(() => {
    if (isGetData) {
      getDataComent();
    }
  }, [isGetData]);

  useEffect(() => {
    getDataComent();
    if (nameCompany && nameCompany !== info?.forumName)
      (async () => {
        const data = await getDataIpfs([nameCompany]);
        data && setCompanyInfo(data[0]);
      })();
    if (nameCompany && nameCompany == info?.forumName)
      (async () => {
        const comHash = await getCompanyHash(nameCompany);
        if (comHash) {
          const data = await getDataIpfs([comHash]);
          data && setCompanyInfo(data[0]);
        }
      })();
  }, [nameCompany]);

  // Reload if page is forum
  useEffect(() => {
    if (isReload) {
      (async () => {
        const comHash = await getCompanyHash(nameCompany);
        if (comHash) {
          const data = await getDataIpfs([comHash]);
          data && setCompanyInfo(data[0]);
        }
      })();
    }
    setIsReload && setIsReload(false);
  }, [isReload]);

  async function getDataComent() {
    if (nameCompany) {
      if (nameCompany !== info?.forumName) {
        const data = await getArrComment(nameCompany);
        setDataComment(data);
        setIsGetData(false);
      }
      if (nameCompany === info?.forumName) {
        const comHash = await getCompanyHash(nameCompany);
        const data = await getArrComment(comHash);
        setDataComment(data);
        setIsGetData(false);
      }
    }
  }

  const onSubmit = async (value: any) => {
    const data = {
      name: value?.name || "",
      comment: value?.comment || "",
      position: value?.position || "",
      salary: value?.salary || "",
      evaluate: value?.evaluate || "",
      nameCompany:
        nameCompany !== info?.forumName
          ? nameCompany
          : await getCompanyHash(info?.forumName),
      dateTime: currentDateTime(),
      ipfsHash: "",
    };

    const res = await uploadIpfsData(data);
    const addNewCmtRes = await addNewComment(
      nameCompany !== info?.forumName
        ? nameCompany
        : await getCompanyHash(info.forumName),
      res,
      addressInfo
    );
    switch (addNewCmtRes) {
      case "INSUFFICIENT_FUNDS":
        setIsModalCmtOpen("INSUFFICIENT_FUNDS");
        return;

      case "ACTION_REJECTED":
        setIsModalCmtOpen("ACTION_REJECTED");
        return;
    }

    const dataHis = {
      nameCompany: companyInfo?.nameCom,
      datetime: data?.dateTime,
      cidCompany: companyInfo?.ipfsHash,
      cidComment: res,
    };
    const resHis = await uploadIpfsData(dataHis);
    await addNewCommentHistory(resHis, addressInfo);
    setIsGetData(true);
    setIsFormReview(false);
    form.reset();
  };

  return (
    <>
      <div className="text-center text-3xl mt-[20px] mb-[15px]">
        {title || `Review ${companyInfo?.nameCom}`}
      </div>
      <div className="flex bg-white px-2 py-2 mb-[30px]">
        <p className="text-[#4d90fc]" onClick={() => router.push("/")}>
          <span className="hover:underline cursor-pointer">Home</span> &nbsp;
        </p>
        <p> / &nbsp;</p>
        <p>
          Review {companyInfo?.nameCom || comInfo?.nameCom} company -{" "}
          {dataComment?.length} times reviewed
        </p>
      </div>
      <CompanyCard
        info={companyInfo || comInfo}
        widthImg={140}
        heightImg={140}
        className="gap-20"
        isDetail
      />
      <button
        onClick={() => {
          setIsFormReview(!isShowFormReview);
        }}
        className="px-4 py-3 bg-[#28a745] border-[#28a745] text-white hover:bg-[#28a765] text-[16px] mb-[30px]"
      >
        Review
      </button>
      {isShowFormReview && (
        <>
          <GridLayout>
            <GridItemSix>
              <Form form={form} onSubmit={onSubmit}>
                <InputTextField
                  label="Your name"
                  className="mb-[10px] px-3 py-2 bg-white"
                  placeholder="Even if the name is fake, enter it"
                  {...form.register("name")}
                />

                <InputTextField
                  label="Position in the company"
                  className="mb-[10px] px-3 py-2 bg-white"
                  placeholder="What do you do in there?"
                  {...form.register("position")}
                />

                <SelectField
                  options={listSalary}
                  className="mb-[10px]"
                  label="Salary"
                  {...form.register("salary")}
                />
                <SelectField
                  options={listEvaluate}
                  className="mb-[10px]"
                  label="Company Reviews"
                  {...form.register("evaluate")}
                />
                <TextArea
                  {...form.register("comment")}
                  label="Your comment"
                  placeholder="Please give your opinion"
                />
                <button
                  type="submit"
                  className="w-[22%] px-3 py-3 mt-[10px] bg-[#28a745] border-[#28a745] text-white hover:bg-[#28a765] text-[16px]"
                >
                  Send review
                </button>
              </Form>
            </GridItemSix>
          </GridLayout>
        </>
      )}

      <CommentReviewer
        dataComment={dataComment || []}
        companyInfo={companyInfo}
      />

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

export default ReviewDetails;
