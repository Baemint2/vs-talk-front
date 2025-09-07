// src/pages/PrivacyPolicy.tsx
import React from "react";

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>

            <section className="mb-6">
                <p>
                    VSTalk(이하 "서비스")은 「개인정보 보호법」 등 관련 법령을 준수하며,
                    이용자의 개인정보를 보호하기 위해 최선을 다하고 있습니다. 본 방침은
                    2025년 4월 개정된 개인정보처리방침 작성지침을 기준으로 작성되었습니다.
                </p>
            </section>

            {/* 1. 수집 항목 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. 수집하는 개인정보 항목 및 수집 방법</h2>
                <p>서비스는 소셜 로그인 기반으로만 운영되며, 다음과 같은 개인정보를 수집합니다.</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>
                        <strong>필수:</strong> 이메일, 소셜 로그인 고유 식별자(ID)
                    </li>
                    <li>
                        <strong>선택:</strong> 프로필 이미지, 닉네임 (소셜 계정에서 제공 동의 시)
                    </li>
                    <li>
                        <strong>자동 수집:</strong> IP 주소, 쿠키, 기기 정보(OS/브라우저), 접속 로그, 서비스 이용 기록
                    </li>
                </ul>
                <p className="mt-2">
                    ※ 개인정보는 소셜 로그인 과정에서 OAuth 제공자(카카오, 네이버, 구글 등)를 통해 수집됩니다.
                </p>
            </section>

            {/* 2. 이용 목적 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. 개인정보의 수집 및 이용 목적</h2>
                <ol className="list-decimal list-inside space-y-1">
                    <li>이용자 식별 및 서비스 로그인 제공</li>
                    <li>게시글, 댓글, 투표, 영상 시청 등 커뮤니티 서비스 제공</li>
                    <li>부정 이용 방지 및 보안 관리</li>
                    <li>고객 문의 응대 및 공지 전달</li>
                    <li>서비스 품질 개선 및 신규 기능 개발</li>
                    <li>법령상 의무 이행 및 분쟁 해결</li>
                </ol>
            </section>

            {/* 3. 보유 기간 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. 개인정보의 보유 및 이용 기간</h2>
                <p>
                    서비스는 원칙적으로 이용자 탈퇴(소셜 계정 연결 해제) 시 개인정보를 지체 없이 파기합니다.
                    단, 관련 법령에 따라 일정 기간 보관할 수 있습니다.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>계약·청약철회 기록: 5년 (전자상거래법)</li>
                    <li>대금 결제 및 재화 공급 기록: 5년 (전자상거래법)</li>
                    <li>소비자 불만 및 분쟁처리 기록: 3년 (전자상거래법)</li>
                    <li>접속 로그(IP 등): 3개월 (통신비밀보호법)</li>
                </ul>
            </section>

            {/* 4. 제3자 제공 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. 개인정보의 제3자 제공</h2>
                <p>
                    서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 근거하거나
                    수사기관이 법적 절차에 따라 요청하는 경우 제공될 수 있습니다.
                </p>
            </section>

            {/* 5. 위탁 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. 개인정보 처리 위탁</h2>
                <p>
                    서비스는 안정적인 운영을 위해 일부 업무를 외부 업체에 위탁할 수 있으며, 위탁 시 개인정보가
                    안전하게 처리되도록 관리·감독합니다.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>AWS (클라우드 서버 운영, 데이터 보관)</li>
                    <li>[예정] 이메일/알림 발송 서비스 업체</li>
                </ul>
            </section>

            {/* 6. 국외 이전 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. 국외 이전에 관한 사항</h2>
                <p>
                    서비스는 Amazon Web Services(AWS) 클라우드 서버를 이용하고 있으며,
                    데이터는 미국 등 해외 리전에 저장될 수 있습니다.
                </p>
                <p className="mt-2">
                    - 이전 국가: 미국(US), 아시아(싱가포르 등) <br />
                    - 이전 일시 및 방법: 서비스 이용 시 네트워크를 통해 전송 <br />
                    - 보유 및 이용 기간: 서비스 운영 기간 동안 <br />
                    - 보호조치: 암호화 저장, 접근권한 통제, 보안 모니터링
                </p>
            </section>

            {/* 7. 파기 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. 개인정보 파기 절차 및 방법</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
                    <li>종이 문서: 분쇄 또는 소각</li>
                </ul>
            </section>

            {/* 8. 이용자 권리 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">8. 이용자의 권리와 행사 방법</h2>
                <p>
                    이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.
                    관련 요청은 <a href="mailto:support@vstalk.com" className="text-blue-600 underline">support@vstalk.com</a> 으로 접수 가능합니다.
                </p>
            </section>

            {/* 9. 자동 수집 장치 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">9. 자동 수집 장치의 설치·운영 및 거부</h2>
                <p>
                    서비스는 맞춤형 이용 환경 제공을 위해 쿠키를 사용할 수 있습니다.
                    이용자는 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있으며,
                    이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
                </p>
            </section>

            {/* 10. 보호 조치 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">10. 개인정보 보호를 위한 기술적·관리적 조치</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>이메일 등 주요 정보 암호화 저장</li>
                    <li>접근 권한 최소화 및 접근 제어</li>
                    <li>보안 시스템을 통한 해킹·악성코드 대응</li>
                    <li>정기적인 보안 점검 및 모니터링</li>
                </ul>
            </section>

            {/* 11. 책임자 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">11. 개인정보 보호책임자</h2>
                <p>
                    - 이름: [운영자명] <br />
                    - 직책: 개인정보 보호책임자 <br />
                    - 이메일: <a href="mailto:support@vstalk.com" className="text-blue-600 underline">support@vstalk.com</a> <br />
                    - 담당 부서: VSTalk 운영팀
                </p>
            </section>

            {/* 12. 고지의 의무 */}
            <section>
                <h2 className="text-xl font-semibold mb-2">12. 고지의 의무</h2>
                <p>
                    본 개인정보처리방침은 <strong>2025년 9월 7일</strong>부터 적용됩니다.
                    내용이 변경될 경우 최소 7일 전 서비스 공지를 통해 안내합니다.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
