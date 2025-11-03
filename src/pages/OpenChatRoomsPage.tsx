
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";

interface ChatRoom {
  id: number;
  name: string;
  url: string;
  description?: string;
}

const chatRooms: ChatRoom[] = [
  {
    id: 1,
    name: "1번방",
    url: "https://open.kakao.com/o/gMQApRSg",
    description: "유튜브 알파GOGOGO 커뮤니티 첫번째 오픈 채팅방입니다."
  },
  {
    id: 2,
    name: "2번방",
    url: "https://open.kakao.com/o/gEF0866g",
    description: "유튜브 알파GOGOGO 커뮤니티 두번째 오픈 채팅방입니다."
  },
  {
    id: 3,
    name: "3번방",
    url: "https://open.kakao.com/o/gNCJvOeh",
    description: "유튜브 알파GOGOGO 커뮤니티 세번째 오픈 채팅방입니다."
  }
];

export default function OpenChatRoomsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRoomClick = (room: ChatRoom) => {
    setSelectedRoom(room);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (selectedRoom) {
      window.open(selectedRoom.url, "_blank", "noopener,noreferrer");
    }
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>오픈 채팅방 | 알파GOGOGO</title>
        <meta name="description" content="알파GOGOGO 커뮤니티의 카카오톡 오픈 채팅방 목록입니다." />
        <meta property="og:title" content="오픈 채팅방 | 알파GOGOGO" />
        <meta property="og:description" content="알파GOGOGO 커뮤니티의 카카오톡 오픈 채팅방 목록입니다." />
        <meta property="og:image" content="/images/ogimage.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">오픈 채팅방</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              알파GOGOGO 커뮤니티의 다양한 오픈 채팅방에 참여하여 정보를 공유하고 소통해보세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {chatRooms.map((room, index) => (
              <div 
                key={room.id}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white border border-purple-100 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-700"></div>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold text-purple-800 mb-2">{room.name}</h2>
                    <p className="text-gray-600 mb-4">{room.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleRoomClick(room)}
                    >
                      입장하기
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
          
          <div className={`mt-12 p-6 bg-purple-50 rounded-lg border border-purple-100 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `500ms` }}>
            <h3 className="text-xl font-semibold text-purple-800 mb-3">참여 안내</h3>
            <p className="text-purple-700">
              • 모든 참여자를 존중하고 예의를 지켜주세요.<br />
              • 스팸, 광고성 메시지는 자제해주시기 바랍니다.<br />
              • 단순 홍보나 비방 목적의 메시지는 제재될 수 있습니다.
            </p>
          </div>
        </div>
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-purple-800">
              채팅방 입장 안내
            </DialogTitle>
            <DialogDescription className="text-center py-3">
              <span className="block text-lg font-medium text-gray-800 mb-2">
                입장코드는 <span className="font-bold text-purple-700">GOGOGO</span> 입니다
              </span>
              <span className="block text-gray-600">
                코드를 복사하여 채팅방에 입장해 주세요.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleConfirm} 
              className="min-w-32 bg-purple-600 hover:bg-purple-700"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
