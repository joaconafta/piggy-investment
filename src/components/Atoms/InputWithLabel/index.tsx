import React from 'react'


interface IInput {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    value: number | string
    label: string
    type?: string
    hasLabel? : boolean
}

const InputWithLabel : React.FC<IInput> = ({onChange, placeholder, value, label, type, hasLabel}) => {
  return (
    <div className='flex flex-col'>
        {hasLabel && <label>{label}</label>}
        <input
            className='w-full p-3 rounded-md border border-gray-400'
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            // value={value}
        />
    </div>
  )
}

export default InputWithLabel