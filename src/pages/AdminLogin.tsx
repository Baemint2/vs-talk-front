import {useState} from "react";
import api from "@/api/axiosConfig.ts";

const AdminLogin = () => {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleLogin = async () => {
        const data = {
            username: username,
            password: password,
        };

        const response = await api.post("v1/login", data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 200) {
            window.location.href = "/";
        }
    };

    return (
        <div className="flex items-center justify-center gap-4 border-2 border-solid border-gray-300 w-80 h-80">
            <form onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col items-center w-11/12"
            >
                <div className={"flex flex-col gap-4 w-11/12"}>
                    <label>아이디</label>
                    <input
                        className="border-2 border-solid border-gray-300"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>비밀번호</label>
                    <input
                        className="border-2 border-solid border-gray-300"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // ✅ 입력값 변경 시 상태 업데이트
                    />
                </div>
                <div className={"flex flex-col items-center gap-4 mt-5 border-2 border-solid border-gray-300 p-3 bg-gray-300"}>
                    <button onClick={handleLogin}>로그인</button>
                </div>
            </form>
        </div>
    )
}

export default AdminLogin;