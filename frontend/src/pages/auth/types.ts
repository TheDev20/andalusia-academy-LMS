export interface AuthPageProps {
  page: 'login' | 'signup' | string;
  onNavigate?: (page: 'login' | 'signup' | string) => void;
}

export interface FormValues {
  name: string;
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export interface FormTouched {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  [key: string]: boolean | undefined;
}
