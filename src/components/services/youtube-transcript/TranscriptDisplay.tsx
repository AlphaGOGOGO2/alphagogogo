
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DownloadCloud, ClipboardCopy, Check } from "lucide-react";
import { toast } from "sonner";

interface TranscriptDisplayProps {
  transcript: string;
}

export function TranscriptDisplay({ transcript }: TranscriptDisplayProps) {
  const [copied, setCopied] = useState(false);

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
  );
}
