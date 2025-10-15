'use client';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import logoImage from '../../../../public/images/logo.png';

interface NavBarProps {
    userName?: string;
    avatarSrc?: string;
}

const Header: React.FC<NavBarProps> = ({
    userName = 'Ashok Khatri',
    avatarSrc,
}) => {
    const sessionData = useSession();
    console.log('Session Data', sessionData);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navItems = [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'kyc', label: 'KYC' },
        { key: 'policy', label: 'My Policies' },
    ];

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isProfileOpen]);

    return (
        <div className="relative">
            <nav className="bg-white shadow-sm w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex py-3">
                            <div className="flex-shrink-0 flex items-center">
                                <Image
                                    src={logoImage}
                                    width={120}
                                    height={64}
                                    alt="Logo"
                                />
                            </div>

                            <div className="ml-6 flex space-x-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        href={`/${item.key}`}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                                            activeTab === item.key
                                                ? 'bg-red-50 text-red-500 rounded-md'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md'
                                        }`}
                                        onClick={() => setActiveTab(item.key)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="ml-3 relative">
                                <div>
                                    <button
                                        type="button"
                                        className="flex rounded-full bg-white focus:outline-none"
                                        onClick={() =>
                                            setIsProfileOpen(!isProfileOpen)
                                        }
                                    >
                                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            {avatarSrc ? (
                                                <Image
                                                    src={avatarSrc}
                                                    alt={userName}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <span>
                                                    {
                                                        sessionData.data?.user
                                                            .name?.[0]
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {isProfileOpen && (
                                    <div
                                        ref={popupRef}
                                        className="z-50 absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    >
                                        <div className="py-3 px-4 border-b border-gray-100">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                                        {avatarSrc ? (
                                                            <Image
                                                                src={avatarSrc}
                                                                alt={userName}
                                                                width={48}
                                                                height={48}
                                                                className="rounded-full"
                                                            />
                                                        ) : (
                                                            <span className="text-lg">
                                                                {
                                                                    sessionData
                                                                        .data
                                                                        ?.user
                                                                        .name?.[0]
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-base font-medium text-gray-800">
                                                        {
                                                            sessionData.data
                                                                ?.user.name
                                                        }
                                                    </div>
                                                    <div className="text-sm font-medium text-red-500">
                                                        {
                                                            sessionData.data
                                                                ?.user.userType
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="py-1"
                                            role="menu"
                                            aria-orientation="vertical"
                                        >
                                            <Link
                                                href="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={() =>
                                                    setIsProfileOpen(false)
                                                }
                                            >
                                                <User className="mr-3 h-5 w-5 text-gray-500" />
                                                My Profile
                                            </Link>
                                            <Button
                                                className="flex cursor-pointer items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                onClick={handleSignOut}
                                            >
                                                <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                                                Sign Out
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
