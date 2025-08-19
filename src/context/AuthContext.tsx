import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    username?: string;
    email?: string;
    // Add other user properties as needed
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("https://dummyjson.com/user/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({

                        username: 'emilys',
                        password: 'emilyspass',
                        expiresInMins: 30, // optional, defaults to 60
                    }),
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []); // Added empty dependency array

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};