import { Address, Chains } from "@balmy/sdk";
import { USDC_ADDRESSES, WMATIC_ADDRESSES } from "./addresses";

export enum TokenType {
  BASE = "BASE",
  NATIVE = "NATIVE",
  WRAPPED_PROTOCOL_TOKEN = "WRAPPED_PROTOCOL_TOKEN",
  YIELD_BEARING_SHARE = "YIELD_BEARING_SHARE",
  ERC20_TOKEN = "ERC20_TOKEN",
  ERC721_TOKEN = "ERC721_TOKEN",
}

export type Token = {
  decimals: number;
  chainId: number;
  address: Address;
  name: string;
  symbol: string;
  logoURI?: string;
  type: TokenType;
  underlyingTokens: Token[];
  price?: number;
  chainAddresses: {
    chainId: number;
    address: Address;
  }[];
};

export const WMATIC = (chainId: number): Token => ({
  chainId,
  decimals: 18,
  address:
    WMATIC_ADDRESSES[chainId] || WMATIC_ADDRESSES[Chains.POLYGON.chainId],
  name: "Wrapped Matic",
  symbol: "WMATIC",
  type: TokenType.BASE,
  underlyingTokens: [],
  logoURI:
    "https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
  chainAddresses: [],
});

export const USDC = (chainId: number): Token => ({
  chainId,
  decimals: 6,
  address: USDC_ADDRESSES[chainId] || USDC_ADDRESSES[Chains.POLYGON.chainId],
  name: "USDC",
  symbol: "USDC",
  type: TokenType.BASE,
  underlyingTokens: [],
  logoURI:
    "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  chainAddresses: [],
});

export const WBTC = (chainId: number): Token => ({
  chainId,
  decimals: 8,
  address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  name: "Wrapped BTC",
  symbol: "WBTC",
  type: TokenType.BASE,
  underlyingTokens: [],
  logoURI:
    "https://tokens.1inch.io/0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6.png",
  chainAddresses: [],
});

export const WRAPPED_PROTOCOL_TOKEN: Record<
  number,
  (chainId: number) => Token
> = {
  [Chains.POLYGON.chainId]: WMATIC,
};

export const getWrappedProtocolToken = (chainId: number) => {
  return WRAPPED_PROTOCOL_TOKEN[chainId](chainId);
};
