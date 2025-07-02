
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePresence(nickname: string, color: string) {
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 채널 구독 상태 추적
  const presenceChannelRef = useRef<any>(null);
  const isSubscribedRef = useRef<boolean>(false);

  useEffect(() => {
    // 이미 구독 중인지 확인
    if (isSubscribedRef.current) return;
    
    try {
      // 기존 채널이 있으면 제거
      if (presenceChannelRef.current) {
        presenceChannelRef.current.unsubscribe();
      }

      // 새 채널 생성 및 구독
      const presenceChannel = supabase.channel("community-presence", {
        config: {
          presence: {
            key: nickname,
          },
        },
      });

      // 채널에 등록하고 사용자 상태 동기화
      presenceChannel
        .on("presence", { event: "sync" }, () => {
          const state = presenceChannel.presenceState();
          const count = Object.keys(state).length;
          setActiveUsersCount(count);
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`사용자 참가: ${key}`, newPresences);
          }
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`사용자 퇴장: ${key}`, leftPresences);
          }
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            // 접속 상태 전송
            await presenceChannel.track({ user: nickname, color: color });
            setIsConnected(true);
            isSubscribedRef.current = true;
          }
          if (process.env.NODE_ENV === 'development') {
            console.log("프레즌스 채널 상태:", status);
          }
        });

      // 채널 참조 저장
      presenceChannelRef.current = presenceChannel;

      return () => {
        // 컴포넌트 언마운트 시 구독 해제
        if (presenceChannelRef.current) {
          if (process.env.NODE_ENV === 'development') {
            console.log("프레즌스 채널 구독 해제");
          }
          presenceChannelRef.current.unsubscribe();
          isSubscribedRef.current = false;
        }
      };
    } catch (err: any) {
      console.error("프레즌스 오류:", err);
      setError(err);
      setIsConnected(false);
    }
  }, [nickname, color]);

  return { 
    activeUsersCount,
    isConnected,
    error
  };
}
