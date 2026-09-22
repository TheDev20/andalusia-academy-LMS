import React, {
  useState, type RefObject, type ChangeEvent, type FocusEvent
} from 'react';

import { Eye, EyeOff, LucideIcon } from 'lucide-react';

export interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  autoComplete?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

function Field({
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  autoComplete,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  inputRef
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        {Icon && <Icon size={17} strokeWidth={1.5} />}
        <input
          ref={inputRef}
          name={name}
          type={isPassword && visible ? 'text' : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        {isPassword && (
          <button
            type="button"
            className="eye"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={(e) => {
              e.preventDefault();
              setVisible(!visible);
            }}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {touched && error && <span className="field-error">{error}</span>}
    </label>
  );
}
export { Field };
export default Field;
