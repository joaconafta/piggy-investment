import FredokaTitle from '@/components/Atoms/FredokaTitle'
import Image, { StaticImageData } from 'next/image'
import React from 'react'
import matt from '../../../../public/matt.svg'
import Button from '@/components/Button'

interface ISavingsOverview {
    amount: number
    title: string
    childSavings? : IChildSavings[]
    isHome?: boolean
    isSaving?: boolean
    setOpenModal? : React.Dispatch<React.SetStateAction<boolean>>
    isInvestment?: boolean

}

interface IChildSavings {
    name: string
    amount: number
    image: StaticImageData
}


const ChildSavings: React.FC<IChildSavings> = ({ name, amount, image }) => {
    return (
        <>

            <div className="w-full p-2">
                <Image
                    src={image}
                    alt="child"
                    width={50}
                    height={50} />
            </div>
            <div>
                <p>{name}</p>
            </div>
            <div className='flex justify-end p-2 w-full'>
                <FredokaTitle className='text-xl font-semibold  '>${amount}</FredokaTitle>
            </div>
        </>

    )
}

const SavingsOverview: React.FC<ISavingsOverview> = ({ amount, title, childSavings, isHome, isSaving, isInvestment, setOpenModal }) => {

    const setOpenModalNewSavingAccount = () => {
        if(setOpenModal) {
            setOpenModal(true)
        }
    }
    return (
        <div className='border border-gray-300 rounded-md bg-neutral-50 p-3'>
            <div>
                <h1 className='text-lg font-bold'>{title}</h1>
                <FredokaTitle className='text-[44px] font-semibold  '>${amount}</FredokaTitle>
            </div>
            {isHome && <div>
                <div className="grid grid-cols-3 justify-items-center items-center border-t-2 border-neutral-200 py-2">
                    {childSavings?.map((childSaving, index) => (
                        <ChildSavings key={index} name={childSaving.name} amount={childSaving.amount} image={childSaving.image} />
                    ))}
                </div>
            </div>}
            {
                isSaving  && <div className='flex justify-center'>
                    <Button onClick={setOpenModalNewSavingAccount}>Add new saving account</Button>
                </div>
            }
            {
                isInvestment && <div className='flex justify-center'>
                    <Button onClick={setOpenModalNewSavingAccount}>Add new investment account</Button>
                </div>
            }
        </div>
    )
}

export default SavingsOverview