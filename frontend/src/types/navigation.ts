export const DEFAULT_ROUTE = "home" as const;

export const ROUTES = {
  HOME: "home",
  ABOUT: "about",
  CONTACT: "contact",
  LOGIN: "login",
  SIGNUP: "signup",
  COURSES: "courses",
  CAREER_PATHS: "career-paths",
  CORPORATE: "corporate",
} as const;

export const SECTION_IDS = {
  COURSES: "courses",
  CAREER_PATHS: "career-paths",
  CORPORATE: "corporate",
} as const;


export const PAGE_ROUTES = [
  "home",
  "about",
  "contact",
  "login",
  "signup",
] as const;
export type PageRoute = (typeof PAGE_ROUTES)[number];

export const SECTION_ROUTES = ["courses", "career-paths", "corporate"] as const;
export type SectionRoute = (typeof SECTION_ROUTES)[number];

export const AUTH_ROUTES = ["login", "signup"] as const;
export type AuthRoute = (typeof AUTH_ROUTES)[number];

export const ALL_ROUTES = [...PAGE_ROUTES, ...SECTION_ROUTES] as const;
export type AppRoute = (typeof ALL_ROUTES)[number];

export type NavigateFunction = (newRoute: AppRoute) => void;

export const isPageRoute = (route: string): route is PageRoute =>
  (PAGE_ROUTES as readonly string[]).includes(route);

export const isSectionRoute = (route: string): route is SectionRoute =>
  (SECTION_ROUTES as readonly string[]).includes(route);

export const isAuthRoute = (route: string): route is AuthRoute =>
  (AUTH_ROUTES as readonly string[]).includes(route);

export const ROUTE_PATHS: Record<AppRoute, string> = {
  home: "/",
  about: "/about",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
  courses: "/#courses",
  "career-paths": "/#career-paths",
  corporate: "/#corporate",
};
