import axios from "axios";
import { create } from "ipfs-http-client";

const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_KEY_SECRET;
const subdomain = process.env.NEXT_PUBLIC_INFURA_GATEWAY_SUBDOMAIN;

export const uploadIpfsData = async (data: any, isFile?: boolean) => {
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const { path } = await client.add({
    content: !isFile ? JSON.stringify(data) : data,
  });
  return path;
};

export const getDataIpfs = async (dataComment: any) => {
  const arr: any = [];
  if (dataComment[0] !== undefined) {
    for (let i in dataComment) {
      const resData = await axios.get(`${subdomain}/ipfs/${dataComment[i]}`);
      const datas = resData.data;
      datas.ipfsHash = dataComment[i];
      arr.push(datas);
    }
  }
  return arr;
};
