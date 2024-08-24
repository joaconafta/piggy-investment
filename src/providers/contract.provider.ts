import { HUB_ADDRESSES } from "@/constants/addresses";
import { Address } from "@balmy/sdk";
import { Contract } from "ethers";

export class ContractProvider {
  private readonly usdcContract: Contract;
  constructor(usdcContract: Contract) {
    this.usdcContract = usdcContract;
  }
  public getHUBCompanionAdress(chainId: number): Address {
    return HUB_ADDRESSES[chainId];
  }

  public buildApproveToken(
    amountToApprove: bigint,
    tokenAddress: Address,
    dcaContractAddress: Address,
  ) {
    const txData = this.usdcContract.interface.encodeFunctionData("approve", [
      dcaContractAddress,
      amountToApprove,
    ]);
    return {
      to: tokenAddress,
      value: BigInt(0),
      data: txData,
    };
  }
}
