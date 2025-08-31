
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X, Vote, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress.tsx';
import api from '@/api/axiosConfig';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type UploadType = 'vote' | 'quiz';

const ExcelUpload = () => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [selectedType, setSelectedType] = React.useState<UploadType | null>(null);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        // Excel 파일만 필터링
        const excelFiles = acceptedFiles.filter(file => {
            const isExcel = file.name.toLowerCase().endsWith('.xlsx') ||
                file.name.toLowerCase().endsWith('.xls');
            if (!isExcel) {
                toast.error(`${file.name}은(는) Excel 파일이 아닙니다.`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name}의 크기가 10MB를 초과합니다.`);
                return false;
            }
            return true;
        });

        setFiles(prev => [...prev, ...excelFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false // 단일 파일만
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setSelectedType(null); // 파일 제거 시 선택 타입도 리셋
    };

    const handleUpload = async (type: UploadType) => {
        if (files.length === 0) {
            toast.error('파일을 선택해주세요.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', files[0]);
            formData.append('type', type); // 구분 파라미터 추가

            // 타입에 따라 다른 엔드포인트 사용

            await api.post('/excel/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percent);
                    }
                }
            });

            const typeText = type === 'vote' ? '투표' : '퀴즈';
            toast.success(`${typeText} Excel 파일이 성공적으로 업로드되었습니다!`);
            setFiles([]);
            setUploadProgress(0);
            setSelectedType(null);

        } catch (error) {
            console.error('업로드 실패:', error);
            toast.error('파일 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Excel 파일 업로드</h2>
                <p className="text-muted-foreground">
                    .xlsx, .xls 형식의 파일을 드래그하거나 클릭하여 업로드하세요 (최대 10MB)
                </p>
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragActive && "border-primary bg-primary/5",
                    isDragReject && "border-destructive bg-destructive/5",
                    !isDragActive && !isDragReject && "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
            >
                <input {...getInputProps()} />

                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />

                {isDragActive ? (
                    <p className="text-lg font-medium text-primary">
                        파일을 여기에 놓으세요...
                    </p>
                ) : (
                    <>
                        <p className="text-lg font-medium mb-2">
                            Excel 파일을 드래그하거나 클릭하세요
                        </p>
                        <p className="text-sm text-muted-foreground">
                            .xlsx, .xls 파일만 지원됩니다
                        </p>
                    </>
                )}
            </div>

            {/* 선택된 파일 목록 */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-medium">선택된 파일</h3>
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFile(index)}
                                disabled={isUploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* 업로드 진행률 */}
            {isUploading && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>업로드 진행률</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                </div>
            )}

            {/* 업로드 타입 선택 및 업로드 버튼 */}
            {files.length > 0 && !isUploading && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-medium text-center">업로드 타입을 선택하세요</h3>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant={selectedType === 'vote' ? 'default' : 'outline'}
                                onClick={() => setSelectedType('vote')}
                                className="flex items-center gap-2 flex-1 max-w-[200px]"
                            >
                                <Vote className="h-4 w-4" />
                                투표 업로드
                            </Button>
                            <Button
                                variant={selectedType === 'quiz' ? 'default' : 'outline'}
                                onClick={() => setSelectedType('quiz')}
                                className="flex items-center gap-2 flex-1 max-w-[200px]"
                            >
                                <Brain className="h-4 w-4" />
                                퀴즈 업로드
                            </Button>
                        </div>
                    </div>

                    {/* 선택된 타입에 따른 업로드 버튼 */}
                    {selectedType && (
                        <Button
                            onClick={() => handleUpload(selectedType)}
                            disabled={isUploading}
                            className="w-full"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {selectedType === 'vote' ? '투표' : '퀴즈'} 파일 업로드
                        </Button>
                    )}
                </div>
            )}

            {/* 업로드 중인 경우 */}
            {isUploading && (
                <Button disabled className="w-full">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    업로드 중... ({uploadProgress}%)
                </Button>
            )}
        </div>
    );
};

export default ExcelUpload;