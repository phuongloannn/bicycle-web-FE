"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();
  
  // State cho thông tin địa chỉ - THAY BẰNG THÔNG TIN CỦA BẠN
  const [addressInfo, setAddressInfo] = useState({
    country: "Việt Nam",
    cityState: "Hà Nội, Việt Nam",
    postalCode: "100000", 
    taxId: "MST123456789",
    address: "1 Trịnh Văn Bô, Nam Từ Liêm, Hà Nội",
    phone: "+84 123 456 789"
  });

  // State cho form editing
  const [formData, setFormData] = useState(addressInfo);

  // ✅ THÊM: Load từ localStorage khi component mount
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userProfile');
    if (savedUserInfo) {
      try {
        const parsedInfo = JSON.parse(savedUserInfo);
        setAddressInfo(prev => ({
          ...prev,
          country: parsedInfo.country || prev.country,
          cityState: parsedInfo.location || prev.cityState,
          address: parsedInfo.address || prev.address,
          phone: parsedInfo.phone || prev.phone
        }));
        setFormData(prev => ({
          ...prev,
          country: parsedInfo.country || prev.country,
          cityState: parsedInfo.location || prev.cityState,
          address: parsedInfo.address || prev.address,
          phone: parsedInfo.phone || prev.phone
        }));
      } catch (error) {
        console.error('Error parsing saved address info:', error);
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
    // Cập nhật thông tin địa chỉ
    setAddressInfo(formData);
    
    // ✅ THÊM: Lưu vào localStorage
    const userProfileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const updatedProfile = {
      ...userProfileData,
      address: formData.address,
      phone: formData.phone,
      location: formData.cityState,
      country: formData.country
    };
    
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // ✅ THÊM: Trigger event để các component khác cập nhật
    window.dispatchEvent(new Event('storage'));
    
    console.log("Saving address info:", formData);
    
    closeModal();
  };

  // Reset form khi mở modal
  const handleOpenModal = () => {
    setFormData(addressInfo);
    openModal();
  };

  // Hủy và đóng modal
  const handleCancel = () => {
    setFormData(addressInfo);
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {addressInfo.country}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  City/State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {addressInfo.cityState}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Postal Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {addressInfo.postalCode}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  TAX ID
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {addressInfo.taxId}
                </p>
              </div>

              {/* Thêm thông tin địa chỉ chi tiết nếu cần */}
              <div className="col-span-2">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {addressInfo.address}
                </p>
              </div>

              <div className="col-span-2">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {addressInfo.phone}
                </p>
              </div>
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

      <Modal isOpen={isOpen} onClose={handleCancel} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your address information.
            </p>
          </div>
          
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input 
                    type="text" 
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>

                <div>
                  <Label>City/State</Label>
                  <Input 
                    type="text" 
                    value={formData.cityState}
                    onChange={(e) => handleInputChange("cityState", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input 
                    type="text" 
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  />
                </div>

                <div>
                  <Label>TAX ID</Label>
                  <Input 
                    type="text" 
                    value={formData.taxId}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                  />
                </div>

                {/* Thêm các trường mới */}
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Phone</Label>
                  <Input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
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