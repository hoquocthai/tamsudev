import contractFactory from "../config/contractFactory.json";

export type ContractConfig = {
  addressOrName: string;
  contractInterface: Array<any>;
};

export const configContract: ContractConfig = {
  addressOrName: contractFactory.address,
  contractInterface: contractFactory.api,
};
