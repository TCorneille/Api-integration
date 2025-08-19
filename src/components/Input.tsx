import React, { ChangeEvent } from "react";

type InputVariant = "default" | "danger";

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  variant?: InputVariant;
}

const variantClasses: Record<InputVariant, string> = {
  default: "border-gray-300 focus:ring-primaryColor-700",
  danger: "border-red-500 focus:ring-red-500",
};

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  value = "",
  onChange,
  placeholder,
  className = "",
  variant = "default",
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-2 rounded-md border-2 ${variantClasses[variant]} ${className}`}
      />
    </div>
  );
};

export default Input;