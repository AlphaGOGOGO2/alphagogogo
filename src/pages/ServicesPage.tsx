
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Youtube, Link2, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>홈으로 돌아가기</span>
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">서비스</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-full">
            알파블로그에서 제공하는 다양한 실용적인 서비스를 이용해보세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-md hover:shadow-lg transition-shadow border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-800 to-purple-600 text-white rounded-t-lg py-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Youtube size={28} className="text-white" />
                  유튜브 자막 추출 서비스
                </CardTitle>
                <CardDescription className="text-white/90 text-base mt-2">
                  YouTube 동영상의 자막을 텍스트로 추출하여 저장하거나 복사할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-6 px-6">
                <p className="text-gray-700 mb-6">
                  YouTube 동영상의 자막을 텍스트로 변환하여 쉽게 복사하고 활용할 수 있습니다.
                  영어 교육 콘텐츠, TED 강연, 자막이 있는 공식 채널 영상에서 가장 잘 작동합니다.
                </p>
                <Link to="/youtube-transcript">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                    <ExternalLink size={16} className="mr-2" />
                    서비스 이용하기
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg py-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Link2 size={28} className="text-white" />
                  URL 단축 서비스
                </CardTitle>
                <CardDescription className="text-white/90 text-base mt-2">
                  긴 URL을 짧고 간결한 링크로 변환하여 공유하기 쉽게 만듭니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-6 px-6">
                <p className="text-gray-700 mb-6">
                  복잡한 URL을 간결하게 줄여 SNS, 메시지, 이메일 등에서 더 깔끔하게 공유할 수 있습니다.
                  단축된 URL은 영구적으로 사용할 수 있습니다.
                </p>
                <Link to="/url-shortener">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                    <ExternalLink size={16} className="mr-2" />
                    서비스 이용하기
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-t-lg py-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <MousePointerClick size={28} className="text-white" />
                  블로그 버튼 생성기
                </CardTitle>
                <CardDescription className="text-white/90 text-base mt-2">
                  블로그용 맞춤형 HTML 버튼을 쉽게 디자인하고 생성할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-6 px-6">
                <p className="text-gray-700 mb-6">
                  색상, 폰트, 크기 등을 원하는 대로 커스터마이징하여 블로그에 사용할 수 있는 
                  매력적인 버튼 HTML 코드를 생성합니다.
                </p>
                <Link to="/blog-button-creator">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                    <ExternalLink size={16} className="mr-2" />
                    서비스 이용하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
