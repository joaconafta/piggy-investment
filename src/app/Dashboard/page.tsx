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

import { useState } from "react";
import ModalAddWallet from "@/components/Dashboard/ModalAddWallet"
import ModalAddWalletChild from "@/components/Dashboard/ModalAddWalletChild"
import ModalConfirm from "@/components/Dashboard/ModalConfirm"

export interface ITab {
    name: string;
    icon: StaticImageData;
    iconPurple?: StaticImageData;
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

const mockTabs: ITab[] = [
    { name: 'Home', icon: home, iconPurple: homePurple },
    { name: 'Savings', icon: savings, iconPurple: savingsPurple },
    { name: 'Investments', icon: investments, iconPurple: investmentsPurple },
    { name: 'Settings', icon: settings, iconPurple: settingsPurple },
];

// title: string
// amount: number
// imageChild: StaticImageData
// imageSavingGoal: StaticImageData
// yieldOn: boolean
// description: string
// autoSave: number

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
    


    const filterSavings = (child: string) => {
        return mockSavings.filter(saving => saving.title === child)
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
                {tab === "Home" && <SavingsOverview
                    isHome={true}
                    amount={100}
                    title='Savings Overview'
                    childSavings={mockChildSavings}
                />}
                {tab === "Home" && <SavingAccounts
                    savings={mockSavings}
                />}
                {tab === "Savings" && <SavingsOverview
                    setOpenModal={() => setOpenModalAddWallet(true)}
                    amount={100}
                    title={`${child}'s Savings`}
                    childSavings={mockChildSavings}
                />}
                {tab === "Savings" && <SavingAccounts
                    savings={filterSavings(child)}
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