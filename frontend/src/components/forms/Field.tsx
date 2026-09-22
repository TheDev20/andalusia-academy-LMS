import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

export interface FieldProps {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: LucideIcon;
}

export default function Field({ label, type = 'text', placeholder, icon: Icon, autoComplete, name }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        {Icon && <Icon size={17} strokeWidth={1.5} />}
        <input
          name={name}
          type={isPassword && visible ? 'text' : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        {isPassword && (
          <button
            type="button"
            className="eye"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </label>
  );
}
