import React, { ReactNode } from "react";

type ButtonType = "button" | "submit" | "reset";

interface ButtonProps {
  children: ReactNode; // Nội dung nút
  size?: "sm" | "md"; // Kích thước nút
  variant?: "primary" | "outline"; // Kiểu hiển thị
  startIcon?: ReactNode; // Icon trước nội dung
  endIcon?: ReactNode; // Icon sau nội dung
  onClick?: () => void; // Hàm xử lý khi click
  disabled?: boolean; // Trạng thái disabled
  className?: string; // Class bổ sung
  type?: ButtonType; // Loại nút: submit, button, reset
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button", // ✅ mặc định là button
}) => {
  // Kích thước
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
  };

  // Kiểu hiển thị
  const variantClasses = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300", // ✅ Tailwind mặc định
    outline:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50",
  };

  return (
    <button
      type={type} // ✅ truyền đúng type
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
