"use client"

import HeadingDashboard from "@/components/Dashboard/Heading"
import matt from '../../../public/matt.svg'
import lucy from '../../../public/lucy.svg'
import moneyBag from '../../../public/moneyBag.svg'
import graduated from '../../../public/graduated.svg'
import SavingAccounts, { ISaving } from "@/components/Dashboard/SavingAccounts"
import { StaticImageData } from "next/image"
import BottomNavigation from "@/components/Dashboard/BottomNavigation"
import home from '../../../public/home.svg';
import savings from '../../../public/savings.svg';
import settings from '../../../public/settings.svg';
import investments from '../../../public/investments.svg';
import homePurple from '../../../public/home-purple.svg';
import savingsPurple from '../../../public/savings-purple.svg';
import settingsPurple from '../../../public/settings-purple.svg';
import investmentsPurple from '../../../public/investments-purple.svg';
import spy from '../../../public/SPY.svg';
import nasdaq from '../../../public/NASDAQ.svg';
import eth from '../../../public/ETH.svg';
import { useState } from "react";
import ModalAddWallet from "@/components/Dashboard/ModalAddWallet"
import ModalAddWalletChild from "@/components/Dashboard/ModalAddWalletChild"
import ModalConfirm from "@/components/Dashboard/ModalConfirm"
import Savings from "@/components/Dashboard/Savings"
import Home from "@/components/Dashboard/Home"
import Investments from "@/components/Dashboard/Investments"
import ModalAddInvestment from "@/components/Dashboard/ModalAddInvestment"
import ModalAddInvestmentChooseType from "@/components/Dashboard/ModalAddInvestmentChooseType"
import ModalAddInvestmentChildCrypto from "@/components/Dashboard/ModalAddInvestmentChildCrypto"
import ModalAddInvestmentConfirm from "@/components/Dashboard/ModalAddInvestmentConfirm"


export interface ITab {
    name: string;
    icon: StaticImageData;
    iconPurple?: StaticImageData;
}

export interface IChildSavings {
    name: string;
    amount: number;
    image: StaticImageData;
}

export interface IChildInvestments extends IChildSavings { }

export const  mockChildSavings = [
    { name: 'Matt', amount: 500, image: matt },
    { name: 'Jane', amount: 500, image: lucy },
];

export const mockChildInvestments = [
    { name: 'Matt', amount: 120, image: matt },
    { name: 'Jane', amount: 120, image: lucy },
];

const mockSavings: ISaving[] = [
    {
        title: 'Matt',
        amount: 100,
        imageChild: matt,
        imageSavingGoal: moneyBag,
        yieldOn: true,
        description: 'Matt saving goal',
        autoSave: 10,
    },
    {
        title: 'Lucy',
        amount: 200,
        imageChild: lucy,
        imageSavingGoal: graduated,
        yieldOn: false,
        description: 'Lucy saving goal',
        autoSave: 20,
    },
];

export interface IInvestment extends ISaving {
    daysLeft: number;
    
}

const mockInvestments: IInvestment[] = [
    {
        title: 'Matt',
        amount: 100,
        imageChild: matt, 
        imageSavingGoal: nasdaq, 
        yieldOn: false,
        description: 'Investment in NASDAQ',
        autoSave: 10,
        daysLeft: 4,
    },
    {
        title: 'Lucy',
        amount: 50,
        imageChild: lucy,
        imageSavingGoal: spy,
        yieldOn: false,
        description: 'Investment in S&P 500',
        autoSave: 20,
        daysLeft: 7,
    },
    {
        title: 'Matt',
        amount: 20,
        imageChild: matt, 
        imageSavingGoal: eth, 
        yieldOn: true,
        description: 'Investment in Ether',
        autoSave: 30,
        daysLeft: 29,
    },
    {
        title: 'Lucy',
        amount: 20,
        imageChild: lucy,
        imageSavingGoal: eth,
        yieldOn: true,
        description: 'Another Investment in Ether',
        autoSave: 30,
        daysLeft: 29,
    },
];


const mockTabs: ITab[] = [
    { name: 'Home', icon: home, iconPurple: homePurple },
    { name: 'Savings', icon: savings, iconPurple: savingsPurple },
    { name: 'Investments', icon: investments, iconPurple: investmentsPurple },
    { name: 'Settings', icon: settings, iconPurple: settingsPurple },
];



export interface IInvestmentChild {
    cryptoAsset: string;
    autosavePercentage: string;
    generateYield: boolean;
    duration : number
}


const Dashboard = () => {
    const [tab, setTab] = useState('Home');
    const [child, setChild] = useState('See All');
    const [openModalAddWallet, setOpenModalAddWallet] = useState(false);
    const [childCreateAccount, setChildCreateAccount] = useState<ISaving | undefined>({} as ISaving);
    const [openModalAddWalletChildForm, setOpenModalAddWalletChildForm] = useState(false);
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const [newWalletChild, setNewWalletChild] = useState({
        title: '',
        autosavePercentage: '',
        generateYield: false,
    });

    const [openModalAddInvestment, setOpenModalAddInvestment] = useState(false);
    const [openModalAddInvestmentChooseType, setOpenModalAddInvestmentChooseType] = useState(false);
    const [modalAddInvestmentChild, setModalAddInvestmentChild] = useState(false);
    const [stockOrCrypto, setStockOrCrypto] = useState<String>('')
    const [newInvestmentChild, setNewInvestmentChild] = useState({
        cryptoAsset: '',
        autosavePercentage: '',
        generateYield: false,
        duration : 0
    })
    const [openInvestmentConfirm, setOpenInvestmentConfirm] = useState(false);

    return (
        <div>
            <ModalAddWallet
                setOpenModalAddWallet={setOpenModalAddWallet}
                children={mockSavings}
                setChildCreateAccount={setChildCreateAccount}
                open={openModalAddWallet}
                childCreateAccount={childCreateAccount}
                setOpenModalAddWalletChildForm={setOpenModalAddWalletChildForm}
            />
            <ModalAddWalletChild
                setOpenModalConfirm={setOpenModalConfirm}
                setOpenModalAddWalletChildForm={setOpenModalAddWalletChildForm}
                setNewWalletChild={setNewWalletChild}
                open={openModalAddWalletChildForm}
                childCreateAccount={childCreateAccount}
            />
            <ModalConfirm
                open={openModalConfirm}
                setOpen={setOpenModalConfirm}
                childCreateAccount={childCreateAccount}
                newWalletChild={newWalletChild}
            />
            <ModalAddInvestment
                childCreateAccount={childCreateAccount}
                open={openModalAddInvestment}
                setOpen={setOpenModalAddInvestment}
                children={mockInvestments}
                setChildCreateAccount={setChildCreateAccount}
                setModalAddInvestmentChooseType={setOpenModalAddInvestmentChooseType}
            />
            <ModalAddInvestmentChooseType
                open = {openModalAddInvestmentChooseType}
                setOpen = {setOpenModalAddInvestmentChooseType}
                setStockOrCrypto={setStockOrCrypto} 
                setModalAddInvestmentChild={setModalAddInvestmentChild}
                stockOrCrypto={stockOrCrypto}
            />
            {stockOrCrypto === 'Crypto' && 
            <ModalAddInvestmentChildCrypto
                open={modalAddInvestmentChild}
                setOpen={setModalAddInvestmentChild}
                childCreateAccount={childCreateAccount}
                setNewInvestmentChild={setNewInvestmentChild}
                setOpenInvestmentConfirm={setOpenInvestmentConfirm} 
            />}
            <ModalAddInvestmentConfirm
                open={openInvestmentConfirm}
                setOpen={setOpenInvestmentConfirm}
                childCreateAccount={childCreateAccount}
                newInvestmentChild={newInvestmentChild}
            />
            <HeadingDashboard
                setTab={setTab}
                setChild={setChild}
                child={child}
            />
            <div className="p-4">
                {tab === "Home" && <Home 
                    balance={1000}
                />}
                {tab === "Savings" && <Savings
                    upperNavigation={child}
                    setOpenModalAddWallet={setOpenModalAddWallet}
                    childSavings={mockChildSavings}
                    savingAccounts={mockSavings}
                />}
                {tab === "Investments" && <Investments
                    setOpenModalAddInvestment={setOpenModalAddInvestment}
                    upperNavigation={child}
                    investments={mockChildInvestments}
                    investmentaccounts={mockInvestments}
                />}
                <BottomNavigation
                    tabs={mockTabs}
                    setTab={setTab}
                    setChild={setChild}
                    tab={tab}
                    child={child}
                />
            </div>
        </div>
    )
}

export default Dashboard