import React, { useMemo, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/Atoms/Select";
import Button from '../Button';
import { ethers } from 'ethers';
import usdcAbi from '@/abis/USDC'
import tokenMessengerAbi from '@/abis/cctp/TokenMessenger';
import messageTransmitterAbi from '@/abis/cctp/MessageTransmitter';
import WalletContextProvider from '@/context/MMConnectContext';
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3';



export const injected = new InjectedConnector({
})

const Swapper : React.FC = () => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [account, setAccount] = useState<string | null>(null);
  
    const onChangeHandler = (value: string) => {
        console.log(value)
    }

    // const connectWallet = async () => {
    //     if (window.ethereum) {
    //       try {
    //         const web3Provider = new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/Fgy1wydMzkEVzqzkufxIT4IIoL15sKQU');
    //         setProvider(web3Provider);
    
    //         // Solicitar cuentas
    //         const accounts = await web3Provider.send("eth_requestAccounts", []);
    //         setAccount(accounts[0]);
    
    //         // Obtener el signer
    //         const signer = await web3Provider.getSigner();
    //         setSigner(signer);
    
    //         console.log('Connected account:', accounts[0]);
    //       } catch (error) {
    //         console.error("Error connecting to MetaMask", error);
    //       }
    //     } else {
    //       alert('MetaMask not detected. Please install MetaMask.');
    //     }
    //   };

    
      const connectWallet = async () => {
          if (window.ethereum) {
              try {
                  // Solicitar al usuario que conecte su cuenta a MetaMask
                  const browserProvider = new ethers.BrowserProvider(window.ethereum);
                  await browserProvider.send("eth_requestAccounts", []);
  
                  // Obtener el signer
                  const signer = await browserProvider.getSigner();
                  const address = await signer.getAddress();
  
                  // Actualizar el estado con el provider, signer y dirección de la cuenta
                  setProvider(browserProvider);
                  setSigner(signer);
                  setAccount(address);
  
                  console.log("Connected with address:", address);
              } catch (error) {
                  console.error("Error connecting to MetaMask:", error);
              }
          } else {
              console.error("MetaMask is not installed");
          }
      };



    const bridge = async () => {
        if (!signer) {
            console.log("No signer available");
            connectWallet()
            return
          }

        console.log("Starting cross-chain transfer...")

         // Set up signers + providers
        // const ethSepoliaProvider = new ethers.JsonRpcProvider(process.env.ETH_SEPOLIA_TESTNET_RPC);
        // const arbSepoliaProvider = new ethers.JsonRpcProvider(process.env.ARB_SEPOLIA_TESTNET_RPC);
        // const ethSepoliaWallet = new ethers.Wallet(process.env.ETH_SEPOLIA_PRIVATE_KEY, ethSepoliaProvider);
        // const arbSepoliaWallet = new ethers.Wallet(process.env.ARB_SEPOLIA_PRIVATE_KEY, arbSepoliaProvider);

        // Testnet Contract Addresses
        const ETH_SEPOLIA_TOKEN_MESSENGER_CONTRACT_ADDRESS = '0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5';
        const USDC_ETH_SEPOLIA_CONTRACT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
        // const POLYGON_AMOY_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS = '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD';
        const ARB_SEPOLIA_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS = '0xacf1ceef35caac005e15888ddb8a3515c41b4872';

        // initialize contracts using address and ABI
        const usdcEthSepoliaContract = new ethers.Contract(USDC_ETH_SEPOLIA_CONTRACT_ADDRESS, usdcAbi, signer);
        const ethSepoliaTokenMessengerContract = new ethers.Contract(ETH_SEPOLIA_TOKEN_MESSENGER_CONTRACT_ADDRESS, tokenMessengerAbi, signer)
        const arbSepoliaMessageTransmitterContract = new ethers.Contract(ARB_SEPOLIA_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS, messageTransmitterAbi, signer);
        // Arbitrum Sepolia destination address
        const mintRecipient = '0xED1952aDf75A5052e85B0276cC90b0DFc6FBf71C'; // does not have to be an EOA
        const destinationAddressInBytes32 = ethers.zeroPadValue(mintRecipient!, 32);
        const ARB_SEPOLIA_DESTINATION_DOMAIN = 3; 
        // const POLYGON_DESTINATION_DOMAIN = 7; // polygon domain

        // Amount that will be transferred
        const amount = BigInt(10);

        // STEP 1: Approve messenger contract to withdraw from our active eth address
        console.log("Approving USDC contract on source chain...")
        const approveTx = await usdcEthSepoliaContract.approve(ETH_SEPOLIA_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount);
        await approveTx.wait();

        // STEP 2: Burn USDC
        console.log("Burning USDC on source chain...")
        const burnTx = await ethSepoliaTokenMessengerContract.depositForBurn(amount, ARB_SEPOLIA_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_SEPOLIA_CONTRACT_ADDRESS);
        const burnTxReceipt = await burnTx.wait();

        // STEP 3: Retrieve message bytes from logs
        const eventTopic = ethers.id('MessageSent(bytes)')
        const log = burnTxReceipt.logs.find((l: { topics: string[]; }) => l.topics[0] === eventTopic);

        let messageBytes, messageBytesHash;
        if (!log) {
            console.log("No MessageSent found!");
            return;
        } else {
            messageBytes = ethers.AbiCoder.defaultAbiCoder().decode(
                ['bytes'], log.data
            );
            messageBytesHash = ethers.keccak256(messageBytes[0]);
        }

        // STEP 4: Fetch attestation signature
        console.log("Fetching attestation signature...");
        let attestationResponse = { status: 'pending', attestation: {}};
        while (attestationResponse.status != 'complete') {
            console.log("Checking for attestation...");
            const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageBytesHash}`);
            attestationResponse = await response.json();
            // check again every 5 seconds
            await new Promise(r => setTimeout(r, 5000));
        }

        const attestationSignature = attestationResponse.attestation;
        console.log(`Attestation Signature: ${attestationSignature}`)

        // STEP 5: Using the message bytes and signature receive the funds on destination chain and address
        console.log("Receiving funds on destination chain...")
        const receiveTx = await arbSepoliaMessageTransmitterContract.receiveMessage(messageBytes[0], attestationSignature);
        console.log(receiveTx)
        const receiveTxReceipt = await receiveTx.wait();
        console.log("Funds received on destination chain!");
        console.log(`See tx details: https://sepolia.arbiscan.io/tx/${receiveTxReceipt.transactionHash}`);
    }
  return (
    <>
    <WalletContextProvider>
        <div className='flex'>
            <Select onValueChange={onChangeHandler}>
                <SelectTrigger>
                    <SelectValue>Option 1</SelectValue>
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="option_1">Option 1</SelectItem>
                        <SelectItem value="option_2">Option 1</SelectItem>
                        <SelectItem value="option_3">Option 1</SelectItem>
                </SelectContent>
            </Select>
            <Select onValueChange={onChangeHandler}>
                <SelectTrigger>
                    <SelectValue>Option 1</SelectValue>
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="option_1">Option 1</SelectItem>
                        <SelectItem value="option_2">Option 1</SelectItem>
                        <SelectItem value="option_3">Option 1</SelectItem>
                </SelectContent>
            </Select>    
        </div>
        <div>
            <Button onClick={() => bridge()}>Click me</Button>
        </div>
        </WalletContextProvider>
    </>
  )
}

export default Swapper