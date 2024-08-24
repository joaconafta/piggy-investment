import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/Atoms/Select";
import Button from '../Button';

const Swapper : React.FC = () => {
    const onChangeHandler = (value: string) => {
        console.log(value)
    }
  return (
    <>
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
            <Button onClick={() => console.log('clicked')}>Click me</Button>
        </div>
    </>
  )
}

export default Swapper