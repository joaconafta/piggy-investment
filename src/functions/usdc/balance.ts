import { Contract } from "ethers";
import { Dispatch } from "react";
import { Address } from "viem";

export const getUsdcBalance = async (contract: Contract, wallet: Address, dispatch: Dispatch<any>) => {
  const balance =await contract.balanceOf(wallet);
  dispatch(balance)

};
