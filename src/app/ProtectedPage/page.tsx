"use client"

import AuthenticationChecker from '@/components/AuthenticationChecker'
import React from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useSmartAccount } from "../hooks/SmartAccountContext";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';



const ProtectedPage = () => {
    const {logout} = usePrivy();
    const { smartAccountAddress, eoa } = useSmartAccount();
    const [balance, setBalance] = useState<any>()


    useEffect (() => {
        if (!smartAccountAddress) return;
        const usdcAbi = [ "function balanceOf(address owner) view returns (uint256)" ]; 
        async function getUSDCBalance(provider: ethers.ContractRunner | null | undefined, usdcContractAddress: string | ethers.Addressable) {
             try { 
                // Crear instancia del contrato de USDC
                const usdcContract = new ethers.Contract(usdcContractAddress, usdcAbi, provider); 
                // Obtener el balance de USDC del Safe smart account
                const usdcBalance = await usdcContract.balanceOf(smartAccountAddress as `0x${string}`);  
                return usdcBalance;
            }
            catch (error) { console.error("Error al obtener el balance de USDC", error); }
        }
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        getUSDCBalance(provider, '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582').then (balance => console.log("balance", balance))
        // smartAccountAddress && provider.getBalance(smartAccountAddress as `0x${string}`).then((balance) => {
        // setBalance(ethers.formatEther(balance))})
    }, [smartAccountAddress])

    // useEffect (() => {
    //     console.log("balance", balance)
    // }, [balance])

    return (
    <AuthenticationChecker>
        <div>
            <h1>Smart Account address: {smartAccountAddress}</h1>
            <p>balance: {balance && balance}</p>
            <button onClick={logout}>Logout</button>
        </div>
    </AuthenticationChecker>
  )
}

export default ProtectedPage