
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { signInWithGoogle, session, signOut } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {!session ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl font-bold mb-4">시작하기</h1>
          <Button 
            onClick={signInWithGoogle} 
            className="w-full max-w-md bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
          >
            Google로 로그인
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl font-bold">환영합니다, {session.user.email}!</h1>
          <Button onClick={signOut} variant="destructive">
            로그아웃
          </Button>
        </div>
      )}
    </div>
  );
}
