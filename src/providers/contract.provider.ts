import { HUB_ADDRESSES } from "@/constants/addresses";
import { Address } from "@balmy/sdk";

export class ContractProvider {
  public getHUBCompanionAdress(chainId: number): Address {
    return HUB_ADDRESSES[chainId];
  }
}
