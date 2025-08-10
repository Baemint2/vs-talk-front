import { useState, useRef, useEffect } from "react";
import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {useUser} from "@/store/UserContext.tsx";

const UserMenu = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { logout } = useUser();

    // ✅ 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <CircleUser
                size={30}
                onClick={() => setOpen(prev => !prev)}
                className="cursor-pointer hover:text-amber-600 transition"
            />

            {open && (
                <div className="absolute bottom-full mb-2 right-0 w-40 bg-white border  text-black border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
                <button
                        onClick={() => {
                            setOpen(false);
                            navigate("/mypage");
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        마이페이지
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            logout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
