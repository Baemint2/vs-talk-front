
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import api from "@/api/axiosConfig";

interface QuizOption {
    id: number;
    optionText: string;
    isCorrect: boolean;
}

interface QuizQuestion {
    id: number;
    question: string;
    options: QuizOption[];
    explanation: string;
}

interface QuizDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryId?: number;
}

const Quiz = ({ open, onOpenChange, categoryId }: QuizDialogProps) => {
    const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 퀴즈 데이터 가져오기
    const fetchQuiz = async () => {
        if (!categoryId) return;

        try {
            setLoading(true);
            setError(null);
            console.log(categoryId)
            const response = await api.get(`/quizzes/post/${categoryId}`);
            setQuiz(response.data.data);
        } catch (error) {
            console.error("퀴즈 가져오기 실패:", error);
            setError("퀴즈를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && categoryId && !quiz) {
            console.log("다이얼로그 열림, 퀴즈 가져오기 시작");
            fetchQuiz();
        }

        // 다이얼로그가 닫힐 때 상태 초기화
        if (!open) {
            setSelectedOption(null);
            setSubmitted(false);
            setError(null);
        }
    }, [open, categoryId]);

    // 다이얼로그 열림/닫힘 처리
    const handleOpenChange = (newOpen: boolean) => {
        console.log("다이얼로그 상태 변경:", newOpen);

        if (!newOpen) {
            // 다이얼로그 닫을 때 상태 초기화
            setSelectedOption(null);
            setSubmitted(false);
            setError(null);
        }

        onOpenChange(newOpen);
    };

    // 퀴즈 제출
    const handleSubmit = async () => {
        if (!selectedOption || !categoryId || !quiz) return;

        try {
            await api.post(`/quizzes/answer`, {
                quizId: quiz.id,
                optionId: selectedOption,
                postId: categoryId
            });

            setSubmitted(true);
        } catch (error) {
            console.error("퀴즈 제출 실패:", error);
            setError("답변 제출 중 오류가 발생했습니다.");
        }
    };

    // 선택한 옵션이 정답인지 확인
    const isCorrect = () => {
        if (!quiz || !selectedOption) return false;
        const option = quiz.options.find(opt => opt.id === selectedOption);
        return option?.isCorrect ?? false;
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        🧠 투표 후 퀴즈
                    </DialogTitle>
                    <DialogDescription>
                        방금 투표하신 주제에 대한 퀴즈입니다. 정답을 맞혀보세요!
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-8 text-center">
                        <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                ) : error ? (
                    <div className="py-6 text-center text-red-500">{error}</div>
                ) : quiz ? (
                    <div className="py-4">
                        <h3 className="font-medium text-lg mb-4">{quiz.question}</h3>

                        <RadioGroup
                            value={selectedOption?.toString()}
                            onValueChange={(value) => setSelectedOption(Number(value))}
                            disabled={submitted}
                        >
                            {quiz.options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center space-x-2 p-3 rounded-lg border ${
                                        submitted && option.isCorrect
                                            ? "border-green-500 bg-green-50"
                                            : submitted && selectedOption === option.id && !option.isCorrect
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200"
                                    }`}
                                >
                                    <RadioGroupItem
                                        value={option.id.toString()}
                                        id={`option-${option.id}`}
                                    />
                                    <Label
                                        htmlFor={`option-${option.id}`}
                                        className="flex-1 cursor-pointer text-black"
                                    >
                                        {option.optionText}
                                    </Label>
                                    {submitted && option.isCorrect && (
                                        <Check className="text-green-500" size={18} />
                                    )}
                                    {submitted && selectedOption === option.id && !option.isCorrect && (
                                        <X className="text-red-500" size={18} />
                                    )}
                                </div>
                            ))}
                        </RadioGroup>

                        {submitted && (
                            <div className={`mt-4 p-4 rounded-lg ${isCorrect() ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                                <p className="font-medium mb-2">
                                    {isCorrect() ? "🎉 정답입니다!" : "😓 틀렸습니다."}
                                </p>
                                <p className="text-sm">{quiz.explanation}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-6 text-center text-gray-500">
                        이 게시물에 대한 퀴즈가 없습니다.
                    </div>
                )}

                <DialogFooter className="flex sm:justify-between items-center">
                    {!submitted && quiz && (
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                        >
                            제출하기
                        </Button>
                    )}
                    {submitted && (
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            닫기
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Quiz;