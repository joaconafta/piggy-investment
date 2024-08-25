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
    const selectedOrigin = 'ETH_SEPOLIA'
    const selectedDestination = 'ARB_SEPOLIA'
    const selectedAmount = 10
    const mintRecipient = '0xED1952aDf75A5052e85B0276cC90b0DFc6FBf71C'; // does not have to be an EOA

    const onChangeHandler = (value: string) => {
        console.log(value)
    }

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

        const chainsFrom = {
          ETH_SEPOLIA: {
            token_messenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
            usdc: ''
          },
          OP_SEPOLIA: {
            token_messenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
            usdc: ''
          },
          ARB_SEPOLIA: {
            token_messenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
            usdc: ''
          },
          POLYGON_AMOY: {
            token_messenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
            usdc: ''
          },
          BASE_SEPOLIA: {
            token_messenger: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
            usdc: ''
          },
          AVAX_FUJI: {
            token_messenger: '0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0',
            usdc: ''
          }
        }

        const chainsTo = {
          ETH_SEPOLIA: {
            message_transmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
            domain: 0
          },
          OP_SEPOLIA: {
            message_transmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
            domain: 2
          },
          ARB_SEPOLIA: {
            message_transmitter: '0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872',
            domain: 3
          },
          POLYGON_AMOY: {
            message_transmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
            domain: 7
          },
          BASE_SEPOLIA: {
            message_transmitter: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
            domain: 6
          },
          AVAX_FUJI: {
            message_transmitter: '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79',
            domain: 1
          }
        }

        const origin = chainsFrom[selectedOrigin]
        const destination = chainsTo[selectedDestination]

        // initialize contracts using address and ABI
        const usdcContract = new ethers.Contract(origin.usdc, usdcAbi, signer);
        const tokenMessengerContract = new ethers.Contract(origin.token_messenger, tokenMessengerAbi, signer)
        const messageTransmitterContract = new ethers.Contract(destination.message_transmitter, messageTransmitterAbi, signer);
        // Arbitrum Sepolia destination address
        const destinationAddressInBytes32 = ethers.zeroPadValue(mintRecipient!, 32);

        // Amount that will be transferred
        const amount = BigInt(selectedAmount);

        // STEP 1: Approve messenger contract to withdraw from our active eth address
        console.log("Approving USDC contract on source chain...")
        const approveTx = await usdcContract.approve(origin.token_messenger, amount);
        await approveTx.wait();

        // STEP 2: Burn USDC
        console.log("Burning USDC on source chain...")
        const burnTx = await tokenMessengerContract.depositForBurn(amount, destination.domain, destinationAddressInBytes32, origin.usdc);
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
        const receiveTx = await messageTransmitterContract.receiveMessage(messageBytes[0], attestationSignature);
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