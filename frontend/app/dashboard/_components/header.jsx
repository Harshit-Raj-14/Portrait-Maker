import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import {Button} from '../../../components/ui/button'

function Header() {
  return (
    <div className='p-3 px-5 flex items-center justify-between shadow-md'>
        <div className='flex gap-3 items-center'>
            <Image src={'/logo.svg'} width={30} height={30} alt='Logo' />
            <h2 className='font-bold text-xl'>Live Portrait Maker</h2>
        </div>
        <div className='flex gap-3 items-center'>
            <Button>Dashboad</Button>
            <UserButton />
        </div>
    </div>
  )
}

export default Header