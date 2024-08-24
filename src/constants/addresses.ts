import { Address, Chains } from "@balmy/sdk";

export const HUB_ADDRESSES: Record<number, Address> = {
  [Chains.POLYGON.chainId]: "0x6C615481E96806edBd9987B6E522A4Ea85d13659",
};

export const USDC_ADDRESSES: Record<number, Address> = {
  [Chains.POLYGON.chainId]: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
};

export const WBTC_ADDRESSES: Record<number, Address> = {
  [Chains.POLYGON.chainId]: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
};

export const WMATIC_ADDRESSES: Record<number, Address> = {
  [Chains.POLYGON.chainId]: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
};
