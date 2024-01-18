import Link from "next/link";
import React from "react";

interface CommentCardProps {
  // datas: {},
}

const CommentCard: React.FunctionComponent<CommentCardProps> = () => {
  return (
    <>
      <div
        id="head"
        className="flex justify-between border-b  px-[50px] py-2 bg-white text-[#999999]"
      >
        <div>
          <div>Anonymous mạo danh ( helloz ) với tư cách là: chơi</div>
          <div>Mức lương: Bèo - Đánh giá: Bánh bèo</div>
        </div>
        <div>
          <div>01/10/2022 15:50</div>
          <div>
            <Link href="#">
              <a className="text-[#4d90fc]">Link chia sẻ</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="comment border-b bg-white px-[50px] py-2 text-[#595959]">
        <p>Thấy có post về H</p>
      </div>
    </>
  );
};

export default CommentCard;
