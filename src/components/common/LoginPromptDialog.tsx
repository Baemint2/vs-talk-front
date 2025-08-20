import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import { useNavigate } from "react-router-dom";

interface LoginPromptDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    actionText?: string;
    cancelText?: string;
}

const LoginPromptDialog = ({
                               open,
                               onOpenChange,
                               title,
                               description,
                               actionText = "로그인하러 가기",
                               cancelText = "취소"
                           }: LoginPromptDialogProps) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        sessionStorage.setItem('returnUrl', window.location.pathname);
        navigate('/login');
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                {index < description.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onOpenChange(false)}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogin}>
                        {actionText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LoginPromptDialog;