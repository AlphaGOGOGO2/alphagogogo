
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

interface BlogPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Local mode - password authentication disabled
 * This is a placeholder component that always redirects to admin dashboard
 */
export function BlogPasswordModal({ isOpen, onClose, onSuccess }: BlogPasswordModalProps) {
  const handleContinue = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
      window.location.href = '/admin';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="로컬 모드"
      className="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md border border-blue-200">
          <ShieldAlert className="text-blue-600 h-5 w-5 mt-0.5" />
          <div className="text-blue-800 text-sm">
            <p className="font-medium">로컬 모드로 실행 중</p>
            <p className="mt-1">
              관리자 페이지로 이동하여 블로그를 관리하세요.
            </p>
          </div>
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
            type="button"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleContinue}
          >
            관리자 페이지로 이동
          </Button>
        </div>
      </div>
    </Modal>
  );
}
