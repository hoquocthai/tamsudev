import { Modal, Button } from "antd";
import React from "react";

interface AlertModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string | React.ReactNode;
  header?: string;
  noFooter?: true;
}

const AlertModal: React.FunctionComponent<AlertModalProps> = ({
  open,
  setOpen,
  title,
  header,
  noFooter,
}) => {
  return (
    <Modal
      title={header ? header : "Metamask alert"}
      centered
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={
        !noFooter && [
          <Button key="back" onClick={() => setOpen(false)}>
            Back
          </Button>,
        ]
      }
      className="review-modal"
    >
      <p className="review-modal__title">{title}</p>
    </Modal>
  );
};

export default AlertModal;
