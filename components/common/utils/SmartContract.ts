import { ethers, utils } from "ethers";
import SendIpfsHash from "../../../artifacts/contracts/SendIpfsHash.sol/SendIpfsHash.json";

export const configSmartContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
    SendIpfsHash.abi,
    signer
  );
  return contract;
};

export const getArrCompany = async () => {
  if (typeof window.ethereum !== "undefined") {
    const contract = configSmartContract();
    const res = await contract.getArrCompany();
    return res;
  }
};

export const getCompanyHash = async (
  companyName: string | string[] | undefined
) => {
  if (typeof window.ethereum !== "undefined") {
    const contract = configSmartContract();
    const res = await contract.getCompanyHash(companyName);
    return res;
  }
};

export const getArrComment = async (companyHash: string | string[]) => {
  if (typeof window.ethereum !== "undefined") {
    const contract = configSmartContract();
    const res = await contract.getArrComment(companyHash);
    return res;
  }
};

export const getArrRepComment = async (commentHash: string) => {
  if (typeof window.ethereum !== "undefined") {
    const contract = configSmartContract();
    const res = await contract.getArrRepComment(commentHash);
    return res;
  }
};

export const getCommentHistory = async () => {
  try {
    if (typeof window.ethereum !== "undefined") {
      const contract = configSmartContract();
      const res = await contract.getCommentHistory();
      return res;
    }
  } catch (error) {}
};

export const addNewCompany = async (
  ipfsCompanyHash: string,
  companyName: string,
  address: string
) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      let overrides = {
        from: address,
        value: utils.parseEther("0.001"),
      };

      const contract = configSmartContract();
      if (address) {
        const res = await contract.addNewCompany(
          ipfsCompanyHash,
          companyName,
          overrides
        );
        await res.wait();
      }
    }
  } catch (error: any) {
    return error.code;
  }
};

export const addNewComment = async (
  ipfsCompanyHash: string,
  ipfsCommentHash: string,
  address: string
) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      let overrides = {
        from: address,
        value: utils.parseEther("0.001"),
      };
      if (address) {
        const contract = configSmartContract();
        const a = await contract.addNewComment(
          ipfsCompanyHash,
          ipfsCommentHash,
          overrides
        );
        await a.wait();
      }
    }
  } catch (error: any) {
    return error.code;
  }
};

export const addNewRepComment = async (
  ipfsRepCommentHash: string,
  ipfsCommentHash: string,
  address: string
) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      let overrides = {
        from: address,
        value: utils.parseEther("0.001"),
      };
      if (address) {
        const contract = configSmartContract();
        const a = await contract.addNewSubComment(
          ipfsRepCommentHash,
          ipfsCommentHash,
          overrides
        );
        await a.wait();
      }
    }
  } catch (error: any) {
    return error.code;
  }
};

export const addNewCommentHistory = async (
  commentHash: string,
  address: string
) => {
  try {
    if (typeof window.ethereum !== "undefined") {
      let overrides = {
        from: address,
        value: utils.parseEther("0.001"),
      };
      if (address) {
        const contract = configSmartContract();
        const a = await contract.addLatestCommentInfo(commentHash, overrides);
        await a.wait();
      }
    }
  } catch (error: any) {
    return error.code;
  }
};
