"use client";

import Link from 'next/link';
import { FaHome, FaUpload, FaFolderOpen, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Blockchain Signature</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/home" className="flex items-center">
                            <FaHome className="mr-2" /> Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/upload" className="flex items-center">
                            <FaUpload className="mr-2" /> Upload
                        </Link>
                    </li>
                    <li>
                        <Link href="/documents" className="flex items-center">
                            <FaFolderOpen className="mr-2" /> Documentos
                        </Link>
                    </li>
                    <li>
                        <Link href="/login" className="flex items-center">
                            <FaSignInAlt className="mr-2" /> Login
                        </Link>
                    </li>
                    <li>
                        <Link href="/signup" className="flex items-center">
                            <FaUserPlus className="mr-2" /> Sign Up
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
