
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { signInWithGoogle, session, signOut } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold mb-4">알파고고고</h1>
        <p className="text-center mb-4">
          알파고고고 서비스를 사용해보세요.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => window.location.href = '/services'}
          >
            서비스 둘러보기
          </Button>
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={() => window.location.href = '/youtube-transcript'}
          >
            유튜브 자막 추출 바로가기
          </Button>
        </div>
      </div>
    </div>
  );
}
