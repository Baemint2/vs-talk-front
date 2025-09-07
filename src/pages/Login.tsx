import naverLogin from "@/assets/btnG_Korean.png";
import kakaoLogin from "@/assets/kakao_login_medium_narrow.png";
import googleLogin from "@/assets/web_light_sq_SI@2x.png";
import logo from "@/assets/logo.png";

const Login = () => {
    const handleLogin = (provider: string) => {
        console.log(import.meta.env.VITE_OAUTH_LOGIN_REDIRECT_URL);
        window.location.href = `${import.meta.env.VITE_OAUTH_LOGIN_REDIRECT_URL}${provider}`;
    };

    return (
        <div className="flex flex-col items-center justify-between bg-white">
            {/* 로그인 버튼 */}
            <div className="flex flex-col items-center gap-4 w-9/12 max-w-xs mt-10">
                <img src={logo} alt="VS TALK" className="w-40 h-40 mb-4" />
                <h1 className="text-2xl font-bold">VS TALK</h1>
                <p className="text-gray-600 mt-2 text-center text-sm">
                    세상의 모든 논쟁을 투표로 즐기는 곳
                    <br />
                    원하는 계정으로 간편하게 시작하세요
                </p>

                <img
                    src={kakaoLogin}
                    alt="카카오 로그인"
                    className="cursor-pointer w-12/12"
                    onClick={() => handleLogin("kakao")}
                />
                <img
                    src={naverLogin}
                    alt="네이버 로그인"
                    className="cursor-pointer"
                    onClick={() => handleLogin("naver")}
                />
                <img
                    src={googleLogin}
                    alt="구글 로그인"
                    className="cursor-pointer"
                    onClick={() => handleLogin("google")}
                />
                <div className="text-center text-xs text-gray-400 mb-6 px-4">
                    로그인 시{" "}
                    <a href="/terms" className="underline">
                        서비스 이용약관
                    </a>{" "}
                    및{" "}
                    <a href="/privacy" className="underline">
                        개인정보 처리방침
                    </a>
                    에 동의한 것으로 간주됩니다.
                </div>
            </div>
        </div>
    );
};

export default Login;
