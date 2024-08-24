import { DCASwapInterval } from "@balmy/sdk";
import { USDC, WBTC } from "../../constants/tokens";
import { BalmyProvider } from "../../providers/balmy.provider";

export const usdcToWBTC = async (
  chainId: number,
  account: string,
  swapInterval: DCASwapInterval,
  swapAmount: string,
  amountToDeposit: string,
) => {
  const balmy = new BalmyProvider();

  const fromToken = USDC(chainId);
  const toToken = WBTC(chainId);

  const position = await balmy.positionProvider.buildCreatePositionTx(
    chainId,
    account,
    fromToken,
    toToken,
    swapInterval,
    swapAmount,
    amountToDeposit,
  );
};
