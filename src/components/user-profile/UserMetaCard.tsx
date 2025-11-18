"use client";
import React, { useState, useRef, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State cho thông tin user
  const [userInfo, setUserInfo] = useState({
    firstName: "Mai Lê Phương",
    lastName: "Loan",
    email: "email_cua_ban@gmail.com",
    phone: "+84 123 456 789",
    bio: "Team Manager",
    location: "Arizona, United States",
    facebook: "https://www.facebook.com/PimjoHQ",
    twitter: "https://x.com/PimjoHQ",
    linkedin: "https://www.linkedin.com/company/pimjo",
    instagram: "https://instagram.com/PimjoHQ"
  });

  // State cho form editing
  const [formData, setFormData] = useState(userInfo);
  
  // State cho avatar
  const [avatar, setAvatar] = useState("/images/user/owner.jpg");
  const [tempAvatar, setTempAvatar] = useState(avatar);

  // ✅ THÊM useEffect ĐỂ LOAD DỮ LIỆU TỪ localStorage KHI COMPONENT MOUNT
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userProfile');
    if (savedUserInfo) {
      try {
        const parsedInfo = JSON.parse(savedUserInfo);
        
        // Cập nhật userInfo
        setUserInfo(prev => ({
          ...prev,
          firstName: parsedInfo.firstName || prev.firstName,
          lastName: parsedInfo.lastName || prev.lastName,
          email: parsedInfo.email || prev.email,
          phone: parsedInfo.phone || prev.phone,
          bio: parsedInfo.bio || prev.bio,
          location: parsedInfo.location || prev.location,
          facebook: parsedInfo.facebook || prev.facebook,
          twitter: parsedInfo.twitter || prev.twitter,
          linkedin: parsedInfo.linkedin || prev.linkedin,
          instagram: parsedInfo.instagram || prev.instagram
        }));
        
        // Cập nhật formData
        setFormData(prev => ({
          ...prev,
          firstName: parsedInfo.firstName || prev.firstName,
          lastName: parsedInfo.lastName || prev.lastName,
          email: parsedInfo.email || prev.email,
          phone: parsedInfo.phone || prev.phone,
          bio: parsedInfo.bio || prev.bio,
          location: parsedInfo.location || prev.location,
          facebook: parsedInfo.facebook || prev.facebook,
          twitter: parsedInfo.twitter || prev.twitter,
          linkedin: parsedInfo.linkedin || prev.linkedin,
          instagram: parsedInfo.instagram || prev.instagram
        }));

        // Cập nhật avatar nếu có
        if (parsedInfo.avatar) {
          setAvatar(parsedInfo.avatar);
          setTempAvatar(parsedInfo.avatar);
        }
      } catch (error) {
        console.error("Error loading user profile from localStorage:", error);
      }
    }
  }, []);

  // Cập nhật form data khi input thay đổi
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Cập nhật thông tin user
    setUserInfo(formData);
    
    // Cập nhật avatar nếu có thay đổi
    if (tempAvatar !== avatar) {
      setAvatar(tempAvatar);
    }
    
    // ✅ Lưu vào localStorage
    const userProfileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      avatar: tempAvatar, // Dùng tempAvatar vì đây là ảnh mới
      phone: formData.phone,
      bio: formData.bio,
      location: formData.location,
      facebook: formData.facebook,
      twitter: formData.twitter,
      linkedin: formData.linkedin,
      instagram: formData.instagram
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfileData));
    
    // ✅ Trigger event để header cập nhật
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('profileUpdated', {
      detail: userProfileData
    }));
    
    console.log("Saving user info:", formData);
    console.log("Avatar updated:", tempAvatar);
    
    closeModal();
  };

  // Reset form khi mở modal
  const handleOpenModal = () => {
    setFormData(userInfo);
    setTempAvatar(avatar);
    openModal();
  };

  // Hủy và đóng modal
  const handleCancel = () => {
    setFormData(userInfo);
    setTempAvatar(avatar);
    closeModal();
  };

  // Xử lý đổi avatar
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ảnh không được vượt quá 5MB!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = e.target?.result as string;
        setTempAvatar(newAvatar);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            {/* Avatar Section với chức năng đổi ảnh */}
            <div className="relative">
              <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 cursor-pointer">
                <Image
                  width={80}
                  height={80}
                  src={avatar}
                  alt="user"
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Edit Avatar Button */}
              <div 
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={handleAvatarClick}
              >
                <svg 
                  className="w-3 h-3 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {userInfo.firstName} {userInfo.lastName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userInfo.bio}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userInfo.location}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <a        
                target="_blank"
                rel="noreferrer" 
                href={userInfo.facebook}
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15 8C15 4 12 1 8 1C4 1 1 4 1 8C1 11.3 3.1 14.1 6.1 14.9V9.9H4.8V8H6.1V6.4C6.1 4.6 7.2 3.5 8.9 3.5C9.7 3.5 10.5 3.6 10.5 3.6V5.2H9.6C8.7 5.2 8.5 5.7 8.5 6.3V8H10.4L10.1 9.9H8.5V14.9C11.9 14.4 15 11.5 15 8Z" fill="currentColor"/>
                </svg>
              </a>

              <a 
                href={userInfo.twitter} 
                target="_blank"
                rel="noreferrer"  
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.6 5.5H14.5L10.3 10.5L15 15.5H10.9L7.8 11.8L4.3 15.5H2.4L6.9 10.1L2.5 5.5H6.7L9.5 8.9L12.6 5.5ZM11.8 14H13.1L5.4 6.5H4L11.8 14Z" fill="currentColor"/>
                </svg>
              </a>

              <a 
                href={userInfo.linkedin} 
                target="_blank"
                rel="noreferrer" 
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 2.5C3.5 3.3 2.8 4 2 4C1.2 4 0.5 3.3 0.5 2.5C0.5 1.7 1.2 1 2 1C2.8 1 3.5 1.7 3.5 2.5ZM3.5 5.5H0.5V15.5H3.5V5.5ZM8.5 5.5H5.5V15.5H8.5V10.5C8.5 8.4 10.4 6.5 12.5 6.5V5.5C10.4 5.5 8.5 7.4 8.5 9.5V15.5H11.5V10.5C11.5 9.1 12.9 7.7 14.3 7.7V5.7C12.9 5.7 11.5 7.1 11.5 8.5V15.5H14.5V9.5C14.5 6.7 12.3 4.5 9.5 4.5C6.7 4.5 4.5 6.7 4.5 9.5V15.5H7.5V5.5Z" fill="currentColor"/>
                </svg>
              </a>

              <a 
                href={userInfo.instagram} 
                target="_blank"
                rel="noreferrer" 
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 4C5.8 4 4 5.8 4 8C4 10.2 5.8 12 8 12C10.2 12 12 10.2 12 8C12 5.8 10.2 4 8 4ZM8 10.5C6.6 10.5 5.5 9.4 5.5 8C5.5 6.6 6.6 5.5 8 5.5C9.4 5.5 10.5 6.6 10.5 8C10.5 9.4 9.4 10.5 8 10.5ZM12.5 3.5C12.5 4.1 12.1 4.5 11.5 4.5C10.9 4.5 10.5 4.1 10.5 3.5C10.5 2.9 10.9 2.5 11.5 2.5C12.1 2.5 12.5 2.9 12.5 3.5ZM15 8C15 4.7 12.3 2 9 2H7C3.7 2 1 4.7 1 8V10C1 13.3 3.7 16 7 16H9C12.3 16 15 13.3 15 10V8ZM13 10C13 12.2 11.2 14 9 14H7C4.8 14 3 12.2 3 10V8C3 5.8 4.8 4 7 4H9C11.2 4 13 5.8 13 8V10Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={handleCancel} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {/* Avatar Upload Section */}
              <div className="mb-6">
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                  Profile Picture
                </h5>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 overflow-hidden border border-gray-300 rounded-full dark:border-gray-600">
                      <Image
                        width={64}
                        height={64}
                        src={tempAvatar}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      Change Photo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange("facebook", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input 
                      type="text" 
                      value={formData.twitter}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Personal Information Section */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name</Label>
                    <Input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input 
                      type="text" 
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Location</Label>
                    <Input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCancel} type="button">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} type="button">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}