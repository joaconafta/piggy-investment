import { BalmyProvider } from "../../providers/balmy.provider";

export const getPositions = async (balmy: BalmyProvider, wallet: string) => {
  return await balmy.positionProvider.getWalletPositions(wallet);
};
