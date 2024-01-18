require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: NEXT_PUBLIC_API_URL,
      accounts: [`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
    },
  },
};
