// components/common/ShareButton.tsx
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
    url: string;
    title: string;
    className?: string;
    variant?: "default" | "floating";
}

const ShareButton = ({ url, title, className = "", variant = "default" }: ShareButtonProps) => {
    const handleShare = async () => {
        if (navigator.share) {
            // 네이티브 공유
            await navigator.share({
                title: title,
                url: url,
            });
        } else {
            // 클립보드 복사
            await navigator.clipboard.writeText(url);
            // 토스트 메시지 표시
            console.log("링크가 복사되었습니다!");
        }
    };

    if (variant === "floating") {
        return (
            <Button
                onClick={handleShare}
                className={`rounded-full w-12 h-12 shadow-lg ${className}`}
                size="icon"
            >
                <Share2 size={20} />
            </Button>
        );
    }

    return (
        <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className={className}
        >
            <Share2 size={16} className="mr-2" />
            공유하기
        </Button>
    );
};

export default ShareButton;