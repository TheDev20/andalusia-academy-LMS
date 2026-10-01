import "./Field.css";
import React, { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export default function Field({
  label,
  type = "text",
  icon: Icon,
  error,
  className = "",
  ...restProps
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label}</span>
      <div className={`input-wrap ${error ? "has-error" : ""}`}>
        {Icon && <Icon size={17} strokeWidth={1.5} />}
        <input type={isPassword && visible ? "text" : type} {...restProps} />
        {isPassword && (
          <button
            type="button"
            className="eye"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
