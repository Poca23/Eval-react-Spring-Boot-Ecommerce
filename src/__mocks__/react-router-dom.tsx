// src/__mocks__/react-router-dom.tsx
export const BrowserRouter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
export const Link = ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>;
export const useNavigate = () => jest.fn();
export const useLocation = () => ({ pathname: '/' });
