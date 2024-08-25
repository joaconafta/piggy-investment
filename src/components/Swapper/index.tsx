import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/Atoms/Select";
import Button from '../Button';


interface ISwapper {
    setValues: React.Dispatch<React.SetStateAction<{
        network: string;
        amount: number;
    }>>;
    values: {
        network: string;
        amount: number;
    };
    setOpen : React.Dispatch<React.SetStateAction<boolean>>;
} 

const Swapper: React.FC<ISwapper> = ({setValues, setOpen, values}) => {

    const onChangeHandlerNetwork = (value: string) => {
        setValues({
            ...values,
            network: value,
        });
    };

    const onChangeHandlerAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            amount: Number(event.target.value),
        });
    };

    const onSwap = () => {  
        setOpen(false)
    }

    return (
        <>
            <div className='flex flex-col gap-y-4'>
                <Select onValueChange={onChangeHandlerNetwork} value={values.network}>
                    <SelectTrigger>
                        <SelectValue>{values.network}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ETH_SEPOLIA">ETH_SEPOLIA</SelectItem>
                        <SelectItem value="OP_SEPOLIA">OP_SEPOLIA</SelectItem>
                        <SelectItem value="ARB_SEPOLIA">ARB_SEPOLIA</SelectItem>
                        <SelectItem value="POLYGON_AMOY">POLYGON_AMOY</SelectItem>
                        <SelectItem value="BASE_SEPOLIA">BASE_SEPOLIA</SelectItem>
                        <SelectItem value="AVAX_FUJI">AVAX_FUJI</SelectItem>
                    </SelectContent>
                </Select>
                <input
                    type="number"
                    value={values.amount}
                    onChange={onChangeHandlerAmount}
                    placeholder="Enter amount"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
            </div>
            <div className='mt-4'>
                <Button onClick = {onSwap}>
                    Deposit
                </Button>
            </div>
        </>
    );
};

export default Swapper;