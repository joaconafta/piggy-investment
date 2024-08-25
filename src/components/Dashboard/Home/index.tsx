import React from 'react'
import SavingAccounts from '../SavingAccounts'
import FredokaTitle from '@/components/Atoms/FredokaTitle'
import Button from '@/components/Button'

interface IHome {
    balance: number
}

const Home : React.FC<IHome> = ({balance}) => {

    const onClickDeposit = () => {
        console.log('Deposit')
    }
    const onClickSend = () => { 
        console.log('Send')
    }

  return (
    <div className="space-y-2">
        <div>Your Balance</div>
        <FredokaTitle className="text-[44px]">${balance}</FredokaTitle>
        <div className="flex gap-2">
            <Button onClick={onClickDeposit}>Deposit</Button>
            <Button onClick={onClickSend}>Send</Button>
        </div>
    </div>
  )
}

export default Home