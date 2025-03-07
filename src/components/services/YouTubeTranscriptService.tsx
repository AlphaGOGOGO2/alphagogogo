
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DownloadCloud, Youtube, Loader2, ClipboardCopy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { extractYouTubeVideoId, createTranscriptProxyUrl } from "@/utils/youtubeUtils";

export function YouTubeTranscriptService() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState("ko");
  const [useProxy, setUseProxy] = useState(true);

  const handleExtractTranscript = async () => {
    // Reset states
    setTranscript("");
    setError("");
    
    const videoId = extractYouTubeVideoId(youtubeUrl);
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Construct the API URL, using proxy if enabled
      let apiUrl = `https://youtube-transcript.vercel.app/api?videoId=${videoId}&lang=${language}`;
      
      if (useProxy) {
        apiUrl = createTranscriptProxyUrl(videoId, language);
      }
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'  // Required by some CORS proxies
        }
      });
      
      if (!response.ok) {
        throw new Error(`자막을 가져오는데 실패했습니다. (${response.status})`);
      }
      
      const data = await response.json();
      
      if (data.transcript) {
        setTranscript(data.transcript);
        toast.success("자막을 성공적으로 가져왔습니다!");
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("자막 추출 오류:", error);
      setError(error instanceof Error ? error.message : "자막을 가져오는데 실패했습니다.");
      toast.error("자막을 가져오는데 실패했습니다. CORS 우회 방법을 사용해보세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!transcript) return;
    
    navigator.clipboard.writeText(transcript)
      .then(() => {
        setCopied(true);
        toast.success("클립보드에 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("클립보드 복사 실패:", err);
        toast.error("클립보드에 복사하는데 실패했습니다.");
      });
  };

  const downloadTranscript = () => {
    if (!transcript) return;
    
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `youtube-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("자막이 다운로드되었습니다!");
  };

  return (
    <section id="youtube-transcript" className="mb-16">
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Youtube size={24} />
            유튜브 자막 추출 서비스
          </CardTitle>
          <CardDescription className="text-white/80">
            YouTube 동영상의 자막을 텍스트로 추출하여 저장하거나 복사할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube 동영상 URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ko">한국어</option>
                  <option value="en">영어</option>
                  <option value="ja">일본어</option>
                  <option value="zh-Hans">중국어 (간체)</option>
                  <option value="zh-Hant">중국어 (번체)</option>
                  <option value="es">스페인어</option>
                  <option value="fr">프랑스어</option>
                  <option value="de">독일어</option>
                  <option value="ru">러시아어</option>
                </select>
              </div>
              
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="use-proxy"
                  checked={useProxy}
                  onChange={(e) => setUseProxy(e.target.checked)}
                  className="mr-2 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="use-proxy" className="text-sm text-gray-600">
                  CORS 우회 사용 (권장)
                </label>
              </div>
              
              <Button
                className="w-full mt-3"
                onClick={handleExtractTranscript}
                disabled={isLoading || !youtubeUrl}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    자막 추출 중...
                  </>
                ) : (
                  "자막 추출하기"
                )}
              </Button>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">오류 발생</p>
                  <p>{error}</p>
                  {error.includes("Failed to fetch") && (
                    <p className="mt-1">
                      CORS 우회 옵션을 활성화했는지 확인하시거나, 다른 YouTube 영상을 시도해보세요.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {transcript && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="transcript" className="block text-sm font-medium text-gray-700">
                    추출된 자막
                  </label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" /> 
                          복사됨
                        </>
                      ) : (
                        <>
                          <ClipboardCopy className="h-4 w-4" /> 
                          복사하기
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={downloadTranscript}
                    >
                      <DownloadCloud className="h-4 w-4" /> 
                      다운로드
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="transcript"
                  value={transcript}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500">
            * 일부 영상은 자막이 제공되지 않거나, 언어가 제한될 수 있습니다. 공개된 자막이 있는 영상에서만 동작합니다.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
