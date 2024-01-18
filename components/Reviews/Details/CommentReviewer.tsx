import { Popover } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AlertModal from "../../../modals/AlertModal";
import { currentDateTime } from "../../common/utils/DateTime";
import { getDataIpfs, uploadIpfsData } from "../../common/utils/Ipfs";
import {
  addNewCommentHistory,
  getArrRepComment,
} from "../../common/utils/SmartContract";
import { Modal } from "../../UI/Modal";
import CommentReply from "./CommentReply";
import FormReply from "./FormReply";

interface CommentReviewerProps {
  dataComment: [];
  companyInfo: any;
}

interface SelectInfo {
  cid: string;
  index: number;
}

const CommentReviewer: React.FunctionComponent<CommentReviewerProps> = ({
  dataComment,
  companyInfo,
}) => {
  const [isShowReplyModal, setIsShowReplyModal] = useState<boolean>(false);
  const [dataInfura, setDataInfura] = useState<[] | null>(null);
  const [cidSelected, setCidSelected] = useState<SelectInfo>({
    cid: "",
    index: -1,
  });
  const [subComment, setSubComment] = useState<
    { cmtHash: string; repCmtArr: [] }[] | null
  >(null);
  const [isShowReply, setIsShowReply] = useState<string[] | null>(null);
  const [subCommentCount, setSubCommentCount] = useState<any>([]);
  const [isReplied, setIsReplied] = useState(false);
  const { address } = useAccount();
  const [addressInfo, setAddressInfo] = useState("");
  const [openShare, setOpenShare] = useState(false);
  const { pathname } = useRouter();
  const { comment } = useRouter().query;
  const [ipfsShared, setIpfsShared] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);

  useEffect(() => {
    if (address) setAddressInfo(address);
  }, [address]);

  useEffect(() => {
    if (comment && dataInfura) {
      const element = document.querySelector(`#comment__${comment}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [comment, dataInfura]);

  useEffect(() => {
    if (dataComment && dataComment.length > 0) {
      handleGetIpfsData();
      setSubCmtNum();
    }
  }, [dataComment]);

  useEffect(() => {
    if (isReplied) {
      let newArr = [...subCommentCount];
      newArr = newArr.map((e, i) => {
        if (i === cidSelected.index) return e + 1;
        return e;
      });
      saveCommendHis();
      setSubCommentCount(newArr);
      handleSetSubComment(cidSelected?.cid);
    }
    setIsReplied(false);
  }, [isReplied]);

  const saveCommendHis = async () => {
    const dataHis = {
      nameCompany: companyInfo?.nameCom,
      datetime: currentDateTime(),
      cidCompany: companyInfo?.ipfsHash,
    };

    const resHis = await uploadIpfsData(dataHis);
    await addNewCommentHistory(resHis, addressInfo);
  };

  const setSubCmtNum = async () => {
    let arr: number[] = [];
    for (let iterator of dataComment) {
      const data = await getArrRepComment(iterator);
      arr.push(data.length || 0);
    }
    setSubCommentCount(arr.slice().reverse());
  };

  const handleGetIpfsData = async () => {
    const data = await getDataIpfs(dataComment);
    setDataInfura(data);
  };

  const handleReply = (val: string, i: number) => {
    setIsShowReplyModal(true);
    setCidSelected({ cid: val, index: i });
  };

  const handleShowRep = (val: string) => {
    handleSetSubComment(val);
  };

  const handleSetSubComment = async (cmtHash: string) => {
    const arrIpfsHash = await getArrRepComment(cmtHash);
    if (arrIpfsHash?.length > 0) {
      setIsShowReply(
        isShowReply?.length ? [...isShowReply, cmtHash] : [cmtHash]
      );
      const data = await getDataIpfs(arrIpfsHash);
      setSubComment(
        subComment
          ? [...subComment, { cmtHash: cmtHash, repCmtArr: data }]
          : [{ cmtHash: cmtHash, repCmtArr: data }]
      );
    }
  };

  const handleCloseModal = () => {
    setIsShowReplyModal(false);
  };

  const handleShare = (ipfs: string) => {
    setIpfsShared(ipfs);
    setOpenShare(true);
  };

  const handleCopy = (e: any) => {
    navigator.clipboard.writeText(e.target.innerHTML);
    setPopoverVisible(true);
    setTimeout(() => {
      setPopoverVisible(false);
    }, 1000);
  };

  return (
    <>
      <div className="mt-[30px]">
        {dataInfura &&
          subCommentCount &&
          dataInfura
            .slice(0)
            .reverse()
            .map((e: any, i: number) => {
              let isShowRep = isShowReply?.includes(e.ipfsHash);
              let subCmtData =
                subComment?.filter((h) => h.cmtHash === e.ipfsHash) || [];

              return (
                <div
                  key={e.ipfsHash}
                  id={`comment__${e.ipfsHash}`}
                  className="mb-2.5"
                >
                  <div
                    id="head"
                    className="flex justify-between border-b  px-5 py-2 bg-white text-[#999999]"
                  >
                    <div>
                      <div>
                        Anonymous personates {e.name && `( ${e.name} )`} behalf
                        of: {e.position}
                      </div>
                      <div>
                        {e.salary && <span>Salary: {e.salary} - </span>}
                        <span>Evaluate: {e.evaluate}</span>
                      </div>
                    </div>
                    <div>
                      <div>{e.dateTime}</div>
                      <div>
                        <a
                          className="text-[#4d90fc] cursor-pointer"
                          onClick={() => handleShare(e.ipfsHash)}
                        >
                          Share link
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="comment border-b bg-white px-5 py-2 text-[#595959]">
                    <p>{e.comment}</p>
                  </div>
                  {isShowRep &&
                    subCmtData.length > 0 &&
                    subCmtData[0].repCmtArr
                      .slice()
                      .reverse()
                      .map((e: any, i) => (
                        <div className="" key={i}>
                          <CommentReply
                            name={e.name}
                            presence={e.presence}
                            reply={e.reply}
                            dateTime={e.dateTime}
                          />
                        </div>
                      ))}

                  {!isShowRep && subCommentCount[i] > 0 && (
                    <div
                      className="reply border-b bg-white px-5 py-2 text-[#4d90fc] cursor-pointer"
                      onClick={() => {
                        handleShowRep(e.ipfsHash);
                      }}
                    >
                      Show reply ({subCommentCount[i]})
                    </div>
                  )}

                  <button
                    onClick={() => handleReply(e.ipfsHash, i)}
                    className="bg-[#28a745] border-[#28a745] text-white hover:bg-[#28a765] text-[16px] px-3 py-3"
                  >
                    Reply
                  </button>
                </div>
              );
            })}

        <Modal
          title="Reply Comment"
          show={isShowReplyModal}
          onClose={handleCloseModal}
        >
          <div className="px-5 py-7 pt-[4px]">
            <FormReply
              ipfsHash={cidSelected?.cid}
              setShow={setIsShowReplyModal}
              setIsReplied={setIsReplied}
            />
          </div>
        </Modal>

        <AlertModal
          open={openShare}
          setOpen={setOpenShare}
          title={
            <Popover content="Copied" open={popoverVisible}>
              <p
                onClick={handleCopy}
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
                className="cursor-pointer"
              >{`${process.env.NEXT_PUBLIC_HOST_URL}${pathname.split("[")[0]}${
                companyInfo.ipfsHash
              }?comment=${ipfsShared}`}</p>
            </Popover>
          }
          header={"Share Link Comment"}
        />
      </div>
    </>
  );
};

export default CommentReviewer;
