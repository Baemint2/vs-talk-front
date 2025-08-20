import naverLogin from "@/assets/btnG_Korean.png";
import kakaoLogin from "@/assets/kakao_login_medium_narrow.png";
import googleLogin from "@/assets/web_light_sq_SI@2x.png";

const Login = () => {

    const handleLogin = (provider: string) => {
        window.location.href = `https://www.vstalk.com/oauth2/authorization/${provider}`;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-center mb-5">간편 로그인</h1>
            <img src={kakaoLogin}
                 alt="카카오 로그인"
                 className="w-8/12"
                 onClick={() => handleLogin("kakao")}
            />
            <img src={naverLogin}
                 alt="네이버 로그인"
                 className="w-8/12"
                 onClick={() => handleLogin("naver")}
            />
            <img id="google-login"
                 src={googleLogin}
                 alt="구글 로그인"
                 className="w-8/12"
                 onClick={() => handleLogin("google")}
            />
        </div>
    )
}

export default Login;