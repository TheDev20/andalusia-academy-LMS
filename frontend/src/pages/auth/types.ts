export interface FormValues {
  name: string;
  email: string;
  password: string;
  rememberMe: boolean;
  [key: string]: string | boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

export interface FormTouched {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  [key: string]: boolean | undefined;
}