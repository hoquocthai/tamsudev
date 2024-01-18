import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import imgLogo from "../../assets/images/tam_su_dev_logo.png";
import { uploadIpfsData } from "../../components/common/utils/Ipfs";
import {
  addNewCompany,
  getCompanyHash,
} from "../../components/common/utils/SmartContract";
import ReviewDetails from "../reviews/[nameCompany]";

interface ForumProps {}
const comInfo = {
  nameCom: "Tâm Sự Developer",
  address: "Internet",
  type: "Troll",
  numMember: "10000+",
  regions: "VN",
};

const info = {
  logo: imgLogo,
  forumName: "tamsudev",
};

const Forum: React.FunctionComponent<ForumProps> = (props) => {
  const [isReload, setIsReload] = useState(false);
  const { address } = useAccount();
  const [addressInfo, setAddressInfo] = useState("");

  useEffect(() => {
    if (address) {
      setAddressInfo(address);
    }
  }, [address]);

  async function createFile() {
    let response = await fetch("/tam_su_dev_logo.png");
    let data = await response.blob();
    let metadata = {
      type: "image/jpeg",
    };
    let file = new File([data], "tam_su_dev_logo.png", metadata);
    return file;
    // ... do something with the file or return it
  }

  useEffect(() => {
    (async () => {
      try {
        let comHash = await getCompanyHash("tamsudev");
        const imgFile = await createFile();
        if (!comHash) {
          const imgHash = await uploadIpfsData(imgFile, true);
          comHash = await uploadIpfsData({ ...comInfo, imageHash: imgHash });
          await addNewCompany(comHash, "tamsudev", addressInfo);
          setIsReload(true);
        }
      } catch (error) {}
    })();
  }, [addressInfo]);

  return (
    <ReviewDetails
      isReload={isReload}
      setIsReload={setIsReload}
      info={info}
      title="Review Tâm Sự Developer"
      comInfo={comInfo}
    />
  );
};

export default Forum;
