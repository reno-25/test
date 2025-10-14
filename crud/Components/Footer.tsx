import React from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";

const Footer = () => {
    return (
        <footer className="w-full flex flex-col sm:flex-row justify-around items-center bg-black py-5 gap-2">
            <Image src={assets.logo_light} alt="" width={120} />
            <p className="text-sm text-white">Blogger Example Project 2025.</p>
        </footer>
    );
};

export default Footer;