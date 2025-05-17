import { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

interface User{
    name: string;
    email: string;
    picture: string;
}

interface AuthContextType{
    user: User | null;
    login: (token: string) => void;
    logout: () => void; 
}

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
)

export function AuthProvider({ children }: {children: React.ReactNode}){
    
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('google_token');
        if(token){
            login(token);
        }
    }, []);

    function login(token: string){
        const decode = jwtDecode<any>(token);

        setUser({
            name: decode.name,
            email: decode.email,
            picture: decode.picture
        })
    }

    function logout(){
        localStorage.removeItem('google_token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
} 

