"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [addressInfo, setAddressInfo] = useState({
    country: "Việt Nam",
    cityState: "Hà Nội, Việt Nam",
    postalCode: "100000",
    taxId: "MST123456789",
    address: "123 Đường ABC, Quận XYZ",
    phone: "+84 123 456 789"
  });

  const [formData, setFormData] = useState(addressInfo);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userProfile");
    if (savedUserInfo) {
      try {
        const parsedInfo = JSON.parse(savedUserInfo);
        const updatedInfo = {
          country: parsedInfo.country || addressInfo.country,
          cityState: parsedInfo.location || addressInfo.cityState,
          postalCode: parsedInfo.postalCode || addressInfo.postalCode,
          taxId: parsedInfo.taxId || addressInfo.taxId,
          address: parsedInfo.address || addressInfo.address,
          phone: parsedInfo.phone || addressInfo.phone
        };
        setAddressInfo(updatedInfo);
        setFormData(updatedInfo);
      } catch (error) {
        console.error("Error parsing saved address info:", error);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setAddressInfo(formData);
    const userProfileData = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const updatedProfile = {
      ...userProfileData,
      country: formData.country,
      location: formData.cityState,
      postalCode: formData.postalCode,
      taxId: formData.taxId,
      address: formData.address,
      phone: formData.phone
    };
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    window.dispatchEvent(new Event("storage"));
    closeModal();
  };

  const handleOpenModal = () => {
    setFormData(addressInfo);
    openModal();
  };

  const handleCancel = () => {
    setFormData(addressInfo);
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-[#B673BF] rounded-2xl bg-[#F2D8EE] lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-[#8B278C] lg:mb-6">Address</h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              {Object.entries(addressInfo).map(([key, value]) => (
                <div key={key} className={key === "address" || key === "phone" ? "col-span-2" : ""}>
                  <p className="mb-2 text-xs text-[#8B278C]/60">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm font-medium text-[#8B278C]">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#B673BF] bg-[#D2A0D9] px-4 py-3 text-sm font-medium text-white shadow hover:bg-[#B673BF] lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleCancel} className="max-w-[700px] m-4">
        <div className="relative w-full p-6 overflow-y-auto bg-white rounded-3xl">
          <h4 className="mb-2 text-2xl font-semibold text-[#8B278C]">Edit Address</h4>
          <p className="mb-6 text-sm text-[#8B278C]/70">Update your address information.</p>

          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className={key === "address" || key === "phone" ? "col-span-2" : ""}>
                  <Label>{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6 justify-end">
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
