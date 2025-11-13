"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserInfo {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phone?: string;
  bio?: string;
  location?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

interface UserContextType {
  userInfo: UserInfo;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  updateAvatar: (avatarUrl: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // State với thông tin mặc định - THAY BẰNG THÔNG TIN CỦA BẠN
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "Mai Lê",
    lastName: "Phương Loan",
    email: "email_cua_ban@gmail.com",
    avatar: "/images/user/owner.jpg",
    phone: "+84 123 456 789",
    bio: "Team Manager",
    location: "Hà Nội, Việt Nam",
    facebook: "https://www.facebook.com/username_cua_ban",
    twitter: "https://x.com/username_cua_ban",
    linkedin: "https://www.linkedin.com/in/username_cua_ban",
    instagram: "https://instagram.com/username_cua_ban"
  });

  // Load từ localStorage khi component mount
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userProfile');
    if (savedUserInfo) {
      try {
        const parsedInfo = JSON.parse(savedUserInfo);
        setUserInfo(parsedInfo);
      } catch (error) {
        console.error('Error parsing saved user info:', error);
      }
    }
  }, []);

  // Save to localStorage whenever userInfo changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userInfo));
  }, [userInfo]);

  const updateUserInfo = (info: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...info }));
  };

  const updateAvatar = (avatarUrl: string) => {
    setUserInfo(prev => ({ ...prev, avatar: avatarUrl }));
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}