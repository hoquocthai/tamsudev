import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getDataIpfs } from "../common/utils/Ipfs";
import { getCommentHistory } from "../common/utils/SmartContract";

interface CommentCardProps {}

interface ComHistoryInfo {
  nameCompany: string;
  datetime: string;
  cidCompany: string;
  cidComment: string;
}

const CommentCard: React.FunctionComponent<CommentCardProps> = (props) => {
  const [commentHistory, setCommentHistory] = useState<ComHistoryInfo[]>();

  useEffect(() => {
    (async () => {
      const resDt = await getCommentHistory();
      const hisData = await getDataIpfs(resDt);
      setCommentHistory(hisData.slice(0).reverse());
    })();
  }, []);

  return (
    <>
      <ul
        style={{
          listStyle: "circle",
        }}
      >
        {commentHistory?.slice(0, 16).map((e, index) => {
          return (
            <li className="" key={index}>
              <Link href={`/reviews/${e.cidCompany}?comment=${e.cidComment}`}>
                <a href="" className="text-[#4d90fc]">
                  Review of: {e.nameCompany}
                </a>
              </Link>
              <p>{e.datetime}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CommentCard;
