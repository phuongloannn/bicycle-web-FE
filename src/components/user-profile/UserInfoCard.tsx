"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  // Thông tin user mẫu đầy đủ
  const [userInfo, setUserInfo] = useState({
    // Personal Information
    firstName: "Loan",
    lastName: "Phương",
    email: "loaniuoi@gmail.com",
    phone: "+84 123 456 789",
    bio: "ngoan xinh iu",
    
    // Address Information
    country: "Việt Nam",
    cityState: "Hà Nội, Việt Nam",
    postalCode: "100000",
    taxId: "MST123456789",
    address: "123 Đường ABC, Quận XYZ",
    
    // Social Links
    facebook: "https://www.facebook.com/username_cua_ban",
    twitter: "https://x.com/username_cua_ban",
    linkedin: "https://www.linkedin.com/in/username_cua_ban",
    instagram: "https://instagram.com/username_cua_ban",
    
    // Additional Info
    dateOfBirth: "1995-05-15",
    gender: "Female",
    occupation: "Designer"
  });

  const [formData, setFormData] = useState(userInfo);

  // Load data từ localStorage khi component mount
  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userProfile");
    if (savedUserInfo) {
      try {
        const parsedInfo = JSON.parse(savedUserInfo);
        setUserInfo(prev => ({ ...prev, ...parsedInfo }));
        setFormData(prev => ({ ...prev, ...parsedInfo }));
      } catch (error) {
        console.error("Error parsing saved user info:", error);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setUserInfo(formData);
    
    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(formData));
    
    console.log("Saving user info:", formData);
    closeModal();
  };

  const handleOpenModal = () => {
    setFormData(userInfo);
    openModal();
  };

  const handleCancel = () => {
    setFormData(userInfo);
    closeModal();
  };

  // Format label từ key (camelCase to Title Case)
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('City State', 'City/State')
      .replace('Tax Id', 'Tax ID')
      .replace('Date Of Birth', 'Date of Birth');
  };

  return (
    <>
      {/* Card hiển thị thông tin */}
      <div className="p-6 border border-[#D2A0D9] rounded-2xl bg-gradient-to-r from-[#F2D8EE] to-[#D4ADD9] shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-[#8B278C] lg:mb-6">
              Personal Information
            </h4>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              <div>
                <p className="text-xs text-[#8B278C]/70 mb-1">First Name</p>
                <p className="text-sm font-semibold text-[#8B278C]">{userInfo.firstName}</p>
              </div>
              <div>
                <p className="text-xs text-[#8B278C]/70 mb-1">Last Name</p>
                <p className="text-sm font-semibold text-[#8B278C]">{userInfo.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-[#8B278C]/70 mb-1">Email</p>
                <p className="text-sm font-semibold text-[#8B278C]">{userInfo.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#8B278C]/70 mb-1">Phone</p>
                <p className="text-sm font-semibold text-[#8B278C]">{userInfo.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-[#8B278C]/70 mb-1">Bio</p>
                <p className="text-sm font-semibold text-[#8B278C]">{userInfo.bio}</p>
              </div>
            </div>

            {/* Address Info Section */}
            <div className="mt-6 pt-6 border-t border-[#D2A0D9]">
              <h5 className="text-lg font-semibold text-[#8B278C] mb-4">Address Information</h5>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                <div>
                  <p className="text-xs text-[#8B278C]/70 mb-1">Country</p>
                  <p className="text-sm font-semibold text-[#8B278C]">{userInfo.country}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B278C]/70 mb-1">City/State</p>
                  <p className="text-sm font-semibold text-[#8B278C]">{userInfo.cityState}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B278C]/70 mb-1">Postal Code</p>
                  <p className="text-sm font-semibold text-[#8B278C]">{userInfo.postalCode}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B278C]/70 mb-1">Tax ID</p>
                  <p className="text-sm font-semibold text-[#8B278C]">{userInfo.taxId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[#8B278C]/70 mb-1">Address</p>
                  <p className="text-sm font-semibold text-[#8B278C]">{userInfo.address}</p>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="mt-6 pt-6 border-t border-[#D2A0D9]">
              <h5 className="text-lg font-semibold text-[#8B278C] mb-4">Social Links</h5>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                <div>
                  <p className="text-xs text-[#8B278C]/70 mb-1">Facebook</p>
                  <p className="text-sm font-semibold text-[#8B278C] truncate">{userInfo.facebook}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B278C]/70 mb-1">Twitter</p>
                  <p className="text-sm font-semibold text-[#8B278C] truncate">{userInfo.twitter}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B278C]/70 mb-1">LinkedIn</p>
                  <p className="text-sm font-semibold text-[#8B278C] truncate">{userInfo.linkedin}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B278C]/70 mb-1">Instagram</p>
                  <p className="text-sm font-semibold text-[#8B278C] truncate">{userInfo.instagram}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex w-full lg:w-auto items-center justify-center gap-2 rounded-full border border-[#B673BF] bg-[#8B278C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B673BF] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal isOpen={isOpen} onClose={handleCancel} className="max-w-[800px] m-4">
        <div className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl shadow-xl max-h-[90vh]">
          <h4 className="mb-2 text-2xl font-bold text-[#8B278C]">
            Edit Personal Information
          </h4>
          <p className="mb-6 text-sm text-[#8B278C]/70">
            Update your personal details, address information, and social links.
          </p>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            {/* Personal Information */}
            <div>
              <h5 className="mb-4 text-lg font-semibold text-[#8B278C] border-b border-[#F2D8EE] pb-2">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'occupation'].map((field) => (
                  <div key={field} className={field === 'bio' ? 'col-span-2' : ''}>
                    <Label>{formatLabel(field)}</Label>
                    <Input
                      type={field === 'dateOfBirth' ? 'date' : field === 'email' ? 'email' : 'text'}
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <Label>Bio</Label>
                  <Input
                    type="text"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h5 className="mb-4 text-lg font-semibold text-[#8B278C] border-b border-[#F2D8EE] pb-2">
                Address Information
              </h5>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {['country', 'cityState', 'postalCode', 'taxId', 'address'].map((field) => (
                  <div key={field} className={field === 'address' ? 'col-span-2' : ''}>
                    <Label>{formatLabel(field)}</Label>
                    <Input
                      type="text"
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h5 className="mb-4 text-lg font-semibold text-[#8B278C] border-b border-[#F2D8EE] pb-2">
                Social Links
              </h5>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map((field) => (
                  <div key={field}>
                    <Label>{formatLabel(field)}</Label>
                    <Input
                      type="url"
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={`https://${field}.com/username`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#F2D8EE]">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancel} 
                type="button"
                className="border-[#B673BF] text-[#8B278C] hover:bg-[#F2D8EE]"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave} 
                type="button"
                className="bg-[#8B278C] text-white hover:bg-[#B673BF]"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}