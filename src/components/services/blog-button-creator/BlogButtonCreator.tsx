
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MousePointerClick, Copy, Check, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ButtonCustomizer } from "./ButtonCustomizer";
import { ButtonPreview } from "./ButtonPreview";
import { ButtonCodeDisplay } from "./ButtonCodeDisplay";

export type ButtonStyle = {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  text: string;
  url: string;
  borderRadius: number;
  padding: string;
  boxShadow: boolean;
  hoverEffect: boolean;
  buttonType: 'primary' | 'outline' | 'ghost' | 'link';
};

export function BlogButtonCreator() {
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    backgroundColor: "#8B5CF6",
    textColor: "#FFFFFF",
    fontSize: 16,
    text: "버튼 클릭하기",
    url: "https://example.com",
    borderRadius: 8,
    padding: "10px 20px",
    boxShadow: true,
    hoverEffect: true,
    buttonType: 'primary'
  });
  
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  
  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-t-lg py-8">
        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
          <MousePointerClick size={32} className="text-white" />
          블로그 버튼 생성기
        </CardTitle>
        <CardDescription className="text-white/90 text-base mt-2">
          블로그용 맞춤형 HTML 버튼을 쉽게 디자인하고 생성할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8 pb-6 px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <ButtonCustomizer buttonStyle={buttonStyle} setButtonStyle={setButtonStyle} />
          </div>
          
          <div className="w-full md:w-1/2">
            <ButtonPreview buttonStyle={buttonStyle} />
            
            <div className="mt-8">
              <Button 
                variant="outline" 
                className="mb-4 w-full bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                onClick={() => setShowHtmlCode(!showHtmlCode)}
              >
                <Code className="mr-2 h-4 w-4" />
                {showHtmlCode ? "코드 숨기기" : "HTML 코드 보기"}
              </Button>
              
              {showHtmlCode && (
                <ButtonCodeDisplay buttonStyle={buttonStyle} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
