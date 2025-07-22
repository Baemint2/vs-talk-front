import React, {createContext, type ReactNode, useContext, useState} from 'react';

interface IUser {
    id: string;
    username: string;
    email: string;
    profile: string;
    nickname: string;
    password: string;
    providerKey: string;
}

interface UserContextType {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps ) => {
    const [user, setUser] = useState<IUser | null>(null); // 초기 상태

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
