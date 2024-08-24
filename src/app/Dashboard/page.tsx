"use client"

import HeadingDashboard from "@/components/Dashboard/Heading"
import SavingsOverview from "@/components/Dashboard/SavingsOverview"
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

const mockChildSavings = [
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
    // Add more savings objects as needed
];

    export interface IInvestment extends ISaving {
        daysLeft: number;
    }

    const mockInvestments: IInvestment[] = [
        {
            title: 'NASDAQ',
            amount: 100,
            imageChild: matt, // Replace with actual image paths
            imageSavingGoal: nasdaq, // Replace with actual image paths
            yieldOn: false,
            description: 'Investment in NASDAQ',
            autoSave: 10,
            daysLeft: 4,
        },
        {
            title: 'S&P 500',
            amount: 50,
            imageChild: lucy, // Replace with actual image paths
            imageSavingGoal: spy, // Replace with actual image paths
            yieldOn: false,
            description: 'Investment in S&P 500',
            autoSave: 20,
            daysLeft: 7,
        },
        {
            title: 'Ether',
            amount: 20,
            imageChild: matt, // Replace with actual image paths
            imageSavingGoal: eth, // Replace with actual image paths
            yieldOn: true,
            description: 'Investment in Ether',
            autoSave: 30,
            daysLeft: 29,
        },
        {
            title: 'Ether',
            amount: 20,
            imageChild: lucy, // Replace with actual image paths
            imageSavingGoal: eth, // Replace with actual image paths
            yieldOn: true,
            description: 'Another Investment in Ether',
            autoSave: 30,
            daysLeft: 29,
        },
        // Add more investments objects as needed
    ];


const mockTabs: ITab[] = [
    { name: 'Home', icon: home, iconPurple: homePurple },
    { name: 'Savings', icon: savings, iconPurple: savingsPurple },
    { name: 'Investments', icon: investments, iconPurple: investmentsPurple },
    { name: 'Settings', icon: settings, iconPurple: settingsPurple },
];


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
    

    const filterInvestments = (child: string) => {
        return mockInvestments.filter(investment => investment.title === child)
    }

    return (
        <div>
            <ModalConfirm
                open={openModalConfirm}
                setOpen={setOpenModalConfirm}
                childCreateAccount={childCreateAccount} 
                newWalletChild={newWalletChild}
            />
            <ModalAddWalletChild
                setOpenModalConfirm={setOpenModalConfirm}
                setOpenModalAddWalletChildForm={setOpenModalAddWalletChildForm}
                setNewWalletChild={setNewWalletChild}
                open = {openModalAddWalletChildForm}
                childCreateAccount={childCreateAccount}
            />
            <ModalAddWallet
                setOpenModalAddWallet={setOpenModalAddWallet}
                children={mockSavings}
                setChildCreateAccount={setChildCreateAccount}
                open = {openModalAddWallet}
                childCreateAccount={childCreateAccount}
                setOpenModalAddWalletChildForm={setOpenModalAddWalletChildForm}
            />
            <HeadingDashboard
                setTab={setTab}
                setChild={setChild}
                child={child}
            />
           
            <div className="p-4">
                {tab === "Home" && <Home/>}
                {tab === "Savings" && <Savings
                    upperNavigation={child}
                    setOpenModalAddWallet={setOpenModalAddWallet}
                    childSavings={mockChildSavings}
                    savingAccounts={mockSavings}
                />}
                {/* {tab === "Investments" && <SavingsOverview
                    isInvestment = {true}
                    amount={100}
                    title='Investments overview'
                    childSavings={mockChildSavings}
                />}
                {tab === "Investments" && <SavingAccounts
                    savings={filterInvestments(child)}
                />} */}
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