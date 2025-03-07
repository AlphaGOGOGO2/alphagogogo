
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MousePointerClick, Copy, Check, Code, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ButtonCustomizer } from "./ButtonCustomizer";
import { ButtonPreview } from "./ButtonPreview";
import { ButtonCodeDisplay } from "./ButtonCodeDisplay";
import { v4 as uuidv4 } from "uuid";

export type ButtonType = 'primary' | 'outline' | 'ghost' | 'link' | 'fullWidth' | 'shiny' | 'grow';

export type ButtonStyle = {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  text: string;
  url: string;
  borderRadius: number;
  padding: string;
  boxShadow: boolean;
  hoverEffect: boolean;
  buttonTypes: ButtonType[];
};

const defaultButtonStyle: Omit<ButtonStyle, 'id' | 'name'> = {
  backgroundColor: "#8B5CF6",
  textColor: "#FFFFFF",
  fontSize: 16,
  text: "버튼 클릭하기",
  url: "https://example.com",
  borderRadius: 8,
  padding: "10px 20px",
  boxShadow: true,
  hoverEffect: true,
  buttonTypes: ['primary']
};

export function BlogButtonCreator() {
  const [buttonStyles, setButtonStyles] = useState<ButtonStyle[]>([
    {
      id: uuidv4(),
      name: "기본 버튼",
      ...defaultButtonStyle
    }
  ]);
  
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  
  const activeButton = buttonStyles[activeButtonIndex];
  
  const addNewButton = () => {
    const newButton: ButtonStyle = {
      id: uuidv4(),
      name: `버튼 ${buttonStyles.length + 1}`,
      ...defaultButtonStyle
    };
    
    setButtonStyles([...buttonStyles, newButton]);
    setActiveButtonIndex(buttonStyles.length);
    toast.success("새 버튼이 추가되었습니다.");
  };
  
  const updateActiveButton = (updatedStyle: Partial<ButtonStyle>) => {
    const updatedButtons = [...buttonStyles];
    updatedButtons[activeButtonIndex] = {
      ...updatedButtons[activeButtonIndex],
      ...updatedStyle
    };
    setButtonStyles(updatedButtons);
  };
  
  const deleteButton = (index: number) => {
    if (buttonStyles.length <= 1) {
      toast.error("최소 하나의 버튼은 유지해야 합니다.");
      return;
    }
    
    const newButtons = buttonStyles.filter((_, i) => i !== index);
    setButtonStyles(newButtons);
    
    // Adjust active index if needed
    if (activeButtonIndex >= newButtons.length) {
      setActiveButtonIndex(newButtons.length - 1);
    } else if (activeButtonIndex === index) {
      setActiveButtonIndex(0);
    }
    
    toast.success("버튼이 삭제되었습니다.");
  };
  
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
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">내 버튼 목록</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addNewButton}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  새 버튼 추가
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {buttonStyles.map((button, index) => (
                  <div 
                    key={button.id}
                    className={`
                      relative group py-2 px-3 rounded-md cursor-pointer transition-all
                      ${activeButtonIndex === index 
                        ? 'bg-purple-100 text-purple-800 font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                    onClick={() => setActiveButtonIndex(index)}
                  >
                    <span>{button.name}</span>
                    {buttonStyles.length > 1 && (
                      <button
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteButton(index);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <ButtonCustomizer 
              buttonStyle={activeButton} 
              setButtonStyle={(updatedStyle) => updateActiveButton(updatedStyle)} 
            />
          </div>
          
          <div className="w-full md:w-1/2">
            <ButtonPreview buttonStyle={activeButton} />
            
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
                <ButtonCodeDisplay buttonStyle={activeButton} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
