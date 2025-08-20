import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CircleUser } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {useUser} from "@/store/UserContext.tsx";

const UserMenu = () => {
    const navigate = useNavigate()
    const { logout } = useUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <CircleUser
                    size={30}
                    className="cursor-pointer hover:text-amber-600 transition"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                side="top"                       // 푸터 위로 고정
                sideOffset={8}                   // 푸터와 간격
                className="w-10 overflow-hidden"
            >
                <DropdownMenuItem
                    onClick={() => {
                        navigate("/mypage")
                    }}
                >
                    마이페이지
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => {
                        logout();
                    }}
                >
                    로그아웃
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu