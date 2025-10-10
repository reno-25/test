import React from "react"
import Image from "next/image"
import { assets } from '@/Assets/assets'

const Header = () => {
    return (
        <div className="py-5 px-5 md:px-12 lg:px-28">
            <div className="flex justify-between items-center">
                <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto' />
                <button  className="flex items-center gap-2 font-medium py-1 px-3 border border-solid border-black ">
                    Get started <Image src={assets.arrow} alt=""  /> 
                </button>
            </div>
            <div className="text-center my-8">
                <h1 className="test-3xl sm:text-5xl font-medium">Page Blogs</h1>
                <p className="mt-10 max-w-[740px] m-auto text-xs sm:text-base">Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
            </div>
        </div>
    )
}

export default Header