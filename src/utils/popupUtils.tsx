
import { toast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { createRoot } from "react-dom/client";

// Global variable to track popup container
let popupContainer: HTMLDivElement | null = null;
let popupRoot: any | null = null;

/**
 * 인앱 알림 메시지를 표시하고 특정 액션을 수행하는 유틸리티 함수
 */
export function openInfoPopup(options: {
  title: string;
  message: string;
  action?: 'link' | 'email';
  actionData?: string;
}) {
  const { title, message, action, actionData } = options;
  
  // Use toast as fallback if modal creation fails
  const fallbackToToast = () => {
    return toast({
      title: title,
      description: message,
      variant: "default",
      duration: 5000, // 5초 후 자동으로 닫힘
      action: action && actionData ? (
        <Button
          onClick={() => {
            if (action === 'link') {
              window.location.href = actionData;
            } else if (action === 'email') {
              window.open(`mailto:${actionData}`, "_blank");
            }
          }}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
        >
          {action === 'link' ? (actionData === '/' ? '홈화면 바로가기' : '채팅방 참여하기') : '이메일 보내기'}
        </Button>
      ) : undefined,
    });
  };

  try {
    // Create container for popup if it doesn't exist
    if (!popupContainer) {
      popupContainer = document.createElement('div');
      popupContainer.id = 'popup-container';
      document.body.appendChild(popupContainer);
      popupRoot = createRoot(popupContainer);
    }

    // Create PopupComponent to render
    const PopupComponent = () => {
      const [isOpen, setIsOpen] = useState(true);
      
      useEffect(() => {
        return () => {
          // Cleanup when component unmounts
          if (popupContainer && popupContainer.childNodes.length === 0) {
            document.body.removeChild(popupContainer);
            popupContainer = null;
            popupRoot = null;
          }
        };
      }, []);

      const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
          if (popupRoot) {
            popupRoot.unmount();
            if (popupContainer) {
              popupContainer.innerHTML = '';
            }
          }
        }, 300);
      };

      const handleAction = () => {
        if (action === 'link' && actionData) {
          window.location.href = actionData;
        } else if (action === 'email' && actionData) {
          window.open(`mailto:${actionData}`, "_blank");
        }
        handleClose();
      };

      // Determine button text based on action and destination
      const getButtonText = () => {
        if (action === 'link') {
          return actionData === '/' ? '홈화면 바로가기' : '채팅방 참여하기';
        }
        return '이메일 보내기';
      };

      return (
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          title={title}
          footer={
            action && actionData ? (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  취소
                </Button>
                <Button 
                  onClick={handleAction}
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                >
                  {getButtonText()}
                </Button>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button onClick={handleClose}>확인</Button>
              </div>
            )
          }
        >
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 my-2">
            <p className="whitespace-pre-line">{message}</p>
          </div>
        </Modal>
      );
    };

    // Render popup
    if (popupRoot) {
      popupRoot.render(<PopupComponent />);
      return true;
    }
    
    return fallbackToToast();
  } catch (error) {
    console.error("Failed to create popup:", error);
    return fallbackToToast();
  }
}
