export type AppRoute = 'home' | 'about' | 'contact' | 'login' | 'signup' | 'courses' | 'career-paths' | 'corporate';

export type NavigateFunction = (newRoute: AppRoute | string) => void;
