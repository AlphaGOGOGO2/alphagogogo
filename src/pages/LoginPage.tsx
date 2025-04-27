
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const { signInWithGoogle, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인된 상태라면 홈으로 리다이렉트
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">로그인</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={signInWithGoogle} 
            className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
          >
            Google로 로그인
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
