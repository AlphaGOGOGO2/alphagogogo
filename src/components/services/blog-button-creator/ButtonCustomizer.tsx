
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ButtonStyle } from "./BlogButtonCreator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ButtonCustomizerProps {
  buttonStyle: ButtonStyle;
  setButtonStyle: React.Dispatch<React.SetStateAction<ButtonStyle>>;
}

export function ButtonCustomizer({ buttonStyle, setButtonStyle }: ButtonCustomizerProps) {
  const handleChange = (field: keyof ButtonStyle, value: any) => {
    setButtonStyle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-purple-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">버튼 커스터마이징</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="buttonText">버튼 텍스트</Label>
          <Input
            id="buttonText"
            value={buttonStyle.text}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="버튼에 표시할 텍스트"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="buttonUrl">버튼 URL</Label>
          <Input
            id="buttonUrl"
            value={buttonStyle.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://example.com"
            type="url"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">배경 색상</Label>
          <div className="flex gap-3 items-center">
            <Input
              id="backgroundColor"
              type="color"
              value={buttonStyle.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={buttonStyle.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="textColor">텍스트 색상</Label>
          <div className="flex gap-3 items-center">
            <Input
              id="textColor"
              type="color"
              value={buttonStyle.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={buttonStyle.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontSize" className="flex justify-between">
            <span>폰트 크기: {buttonStyle.fontSize}px</span>
          </Label>
          <Slider
            id="fontSize"
            value={[buttonStyle.fontSize]}
            min={10}
            max={32}
            step={1}
            onValueChange={(value) => handleChange('fontSize', value[0])}
            className="py-2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="borderRadius" className="flex justify-between">
            <span>테두리 둥글기: {buttonStyle.borderRadius}px</span>
          </Label>
          <Slider
            id="borderRadius"
            value={[buttonStyle.borderRadius]}
            min={0}
            max={24}
            step={1}
            onValueChange={(value) => handleChange('borderRadius', value[0])}
            className="py-2"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="boxShadow" className="cursor-pointer">그림자 효과</Label>
          <Switch
            id="boxShadow"
            checked={buttonStyle.boxShadow}
            onCheckedChange={(checked) => handleChange('boxShadow', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="hoverEffect" className="cursor-pointer">호버 효과</Label>
          <Switch
            id="hoverEffect"
            checked={buttonStyle.hoverEffect}
            onCheckedChange={(checked) => handleChange('hoverEffect', checked)}
          />
        </div>
        
        <div className="space-y-2 pt-2">
          <Label>버튼 스타일</Label>
          <RadioGroup 
            value={buttonStyle.buttonType} 
            onValueChange={(value) => handleChange('buttonType', value)}
            className="flex flex-col space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="primary" id="primary" />
              <Label htmlFor="primary">기본 (채워진 배경)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outline" id="outline" />
              <Label htmlFor="outline">아웃라인 (테두리만)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ghost" id="ghost" />
              <Label htmlFor="ghost">고스트 (배경 없음)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="link" id="link" />
              <Label htmlFor="link">링크 (밑줄)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fullWidth" id="fullWidth" />
              <Label htmlFor="fullWidth">가로 확장 (100% 너비)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shiny" id="shiny" />
              <Label htmlFor="shiny">반짝이는 버튼 (애니메이션)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grow" id="grow" />
              <Label htmlFor="grow">확대 버튼 (호버 시 커짐)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
