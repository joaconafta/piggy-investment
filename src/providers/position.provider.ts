import { getWrappedProtocolToken, Token } from "@/constants/tokens";
import {
  BuiltTransaction,
  DCAPermission,
  DCASwapInterval,
  IDCAService,
} from "@balmy/sdk";
import { parseUnits } from "viem/utils";
import { ContractProvider } from "./contract.provider";
import { SmartAccountClient } from "permissionless";
import { EntryPoint } from "permissionless/types";
import { SmartAccount } from "permissionless/accounts";
import { Address, Chain, Transport } from "viem";

export interface IBuildPositionParams {
  chainId: number;
  account: string;
  from: Token;
  to: Token;
  swapInterval: DCASwapInterval;
  swapsAmount: string;
  amount: string;
}

export type SafeClient = SmartAccountClient<
  EntryPoint,
  Transport,
  Chain,
  SmartAccount<EntryPoint, string, Transport, Chain>
>;

export class PositionProvider {
  private readonly dcaService: IDCAService;

  private readonly contractProvider: ContractProvider;

  private readonly safeClient: SafeClient;

  constructor(
    dcaService: IDCAService,
    contractProvider: ContractProvider,
    safe: SafeClient,
  ) {
    this.dcaService = dcaService;
    this.contractProvider = contractProvider;
    this.safeClient = safe;
  }

  async buildCreatePositionTx({
    chainId,
    account,
    from,
    to,
    swapInterval,
    swapsAmount,
    amount,
  }: IBuildPositionParams): Promise<BuiltTransaction> {
    const params = this.buildCreatePositionParams({
      chainId,
      account,
      from,
      to,
      swapInterval,
      swapsAmount,
      amount,
    });
    console.log(params)

    return await this.dcaService.buildCreatePositionTx(params);
  }

  private buildCreatePositionParams({
    chainId,
    account,
    from,
    to,
    swapInterval,
    swapsAmount,
    amount,
  }: IBuildPositionParams) {
    const amountOfSwaps = BigInt(swapsAmount);
    const totalAmount = parseUnits(amount, from.decimals);
    const deposit = {
      token: from.address.toLowerCase(),
      amount: totalAmount,
    };
    const companionAddress =
      this.contractProvider.getHUBCompanionAdress(chainId);
    const permissions = [
      {
        operator: companionAddress.toLowerCase(),
        permissions: [
          DCAPermission.REDUCE,
          DCAPermission.INCREASE,
          DCAPermission.WITHDRAW,
          DCAPermission.TERMINATE,
        ],
      },
    ];
    const wrappedProtocolToken = getWrappedProtocolToken(chainId);
    const fromToUse = wrappedProtocolToken.address.toLowerCase();
    const toToUse = wrappedProtocolToken.address.toLowerCase();
    return {
      chainId,
      from: {
        address: from.address.toLowerCase(),
        variantId: fromToUse,
      },
      to: {
        address: to.address.toLowerCase(),
        variantId: toToUse,
      },
      permissions,
      swapInterval: Number(swapInterval),
      amountOfSwaps: Number(amountOfSwaps),
      owner: account.toLowerCase(),
      deposit,
    };
  }

  async depositSafe(params: IBuildPositionParams) {
    console.log("deposit on balmy");
    const depositTx = await this.buildCreatePositionTx(params);
    console.log("result");
    console.log(depositTx);

    console.log("deposit safe");
    return await this.safeClient.sendTransaction({
      to: params.account as Address,
      value: depositTx.value,
      data: depositTx.data as Address,
    });
  }
}
