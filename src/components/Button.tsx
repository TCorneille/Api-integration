import React from "react";

type ButtonVariant = "primary" | "danger";

interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primaryColor-800 text-white hover:bg-primaryColor-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const Button: React.FC<ButtonProps> = ({
  label,
  type = "button",
  className = "",
  onClick,
  disabled = false,
  variant = "primary",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-semibold disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;