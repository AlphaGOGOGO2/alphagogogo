
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { secureLogin, checkLoginRateLimit, recordLoginAttempt, clearLoginAttempts, getLoginBackoffDelay } from "@/services/secureAuthService";

interface BlogPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // 성공 시 콜백 추가
}

export function BlogPasswordModal({ isOpen, onClose, onSuccess }: BlogPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Check rate limiting
      if (!checkLoginRateLimit()) {
        setError("너무 많은 로그인 시도입니다. 15분 후 다시 시도해주세요.");
        setIsSubmitting(false);
        return;
      }

      // 반복 실패 시 지수 백오프 지연 적용
      const backoff = getLoginBackoffDelay();
      if (backoff > 0) await new Promise((r) => setTimeout(r, backoff));

      // Use secure login service
      const result = await secureLogin("admin@example.com", password);
      
      if (result.success) {
        clearLoginAttempts();
        setIsSubmitting(false);

        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
          navigate("/blog/write");
        }
      } else {
        recordLoginAttempt();
        setError(result.message || "비밀번호가 올바르지 않습니다.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Unexpected error during authentication:", error);
      setError("인증 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="관리자 인증"
      className="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-md border border-amber-200">
          <ShieldAlert className="text-amber-600 h-5 w-5 mt-0.5" />
          <div className="text-amber-800 text-sm">
            <p className="font-medium">글쓰기는 관리자만 사용할 수 있습니다</p>
            <p className="mt-1">
              {import.meta.env.VITE_LOCAL_MODE === 'true'
                ? '계속하려면 관리자 비밀번호를 입력하세요.'
                : '계속하려면 관리자 비밀번호를 입력하세요.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호 입력"
              className="w-full"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  인증 중...
                </>
              ) : (
                "인증하기"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
