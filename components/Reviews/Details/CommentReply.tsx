import Link from "next/link";
import React from "react";

interface CommentReplyProps {
  name: string;
  presence: string;
  reply: string;
  dateTime: string;
}

const CommentReply: React.FunctionComponent<CommentReplyProps> = ({
  name,
  presence,
  reply,
  dateTime,
}) => {
  return (
    <>
      <div>
        <div
          id="head"
          className="flex justify-between border-b px-[50px] py-2 bg-white text-[#999999]"
        >
          <div>
            Anonymous {name && `personates ( ${name} )`}{" "}
            {presence && `shows an attitude ${presence} and`} retaliates:
          </div>
          <div>
            <div>{dateTime}</div>
          </div>
        </div>
        <div className="comment border-b bg-white px-[50px] py-2 text-[#595959]">
          <p>{reply}</p>
        </div>
      </div>
    </>
  );
};

export default CommentReply;
