import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ButtonStyle, ButtonType } from "./BlogButtonCreator";
import { Checkbox } from "@/components/ui/checkbox";

interface ButtonCustomizerProps {
  buttonStyle: ButtonStyle;
  setButtonStyle: (updatedStyle: Partial<ButtonStyle>) => void;
}

export function ButtonCustomizer({ buttonStyle, setButtonStyle }: ButtonCustomizerProps) {
  const handleChange = (field: keyof ButtonStyle, value: any) => {
    setButtonStyle({ [field]: value });
  };

  const toggleButtonType = (type: ButtonType) => {
    const currentTypes = [...buttonStyle.buttonTypes];
    
    // Handle primary vs outline/ghost (they're mutually exclusive)
    if (type === 'primary') {
      // Remove outline and ghost if primary is selected
      const filteredTypes = currentTypes.filter(t => t !== 'outline' && t !== 'ghost');
      
      // If primary wasn't already in the list, add it
      if (!currentTypes.includes('primary')) {
        filteredTypes.push('primary');
      } else {
        // If primary was the only type, don't remove it
        if (currentTypes.length === 1 && currentTypes[0] === 'primary') {
          return; // Don't allow removing the only type
        }
        // Otherwise remove primary
        const index = filteredTypes.indexOf('primary');
        if (index !== -1) filteredTypes.splice(index, 1);
      }
      
      handleChange('buttonTypes', filteredTypes);
      return;
    }
    
    if (type === 'outline' || type === 'ghost') {
      // Remove primary, and the other one (outline or ghost) if selected
      const otherType = type === 'outline' ? 'ghost' : 'outline';
      const filteredTypes = currentTypes.filter(t => t !== 'primary' && t !== otherType);
      
      // Toggle the current type
      const index = currentTypes.indexOf(type);
      if (index === -1) {
        filteredTypes.push(type);
      } else {
        // If it was the only type, don't remove it
        if (currentTypes.length === 1 && currentTypes[0] === type) {
          return; // Don't allow removing the only type
        }
        filteredTypes.splice(index, 1);
      }
      
      handleChange('buttonTypes', filteredTypes);
      return;
    }
    
    // For other types, just toggle them
    const index = currentTypes.indexOf(type);
    if (index === -1) {
      currentTypes.push(type);
    } else {
      // If it was the only type, don't remove it
      if (currentTypes.length === 1 && currentTypes[0] === type) {
        return; // Don't allow removing the only type
      }
      currentTypes.splice(index, 1);
    }
    
    handleChange('buttonTypes', currentTypes);
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
          <Label>버튼 스타일 (다중 선택 가능)</Label>
          <div className="flex flex-col space-y-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="primary" 
                checked={buttonStyle.buttonTypes.includes('primary')}
                onCheckedChange={() => toggleButtonType('primary')}
              />
              <Label htmlFor="primary" className="cursor-pointer">기본 (채워진 배경)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="outline" 
                checked={buttonStyle.buttonTypes.includes('outline')}
                onCheckedChange={() => toggleButtonType('outline')}
              />
              <Label htmlFor="outline" className="cursor-pointer">아웃라인 (테두리만)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ghost" 
                checked={buttonStyle.buttonTypes.includes('ghost')}
                onCheckedChange={() => toggleButtonType('ghost')}
              />
              <Label htmlFor="ghost" className="cursor-pointer">고스트 (배경 없음)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="link" 
                checked={buttonStyle.buttonTypes.includes('link')}
                onCheckedChange={() => toggleButtonType('link')}
              />
              <Label htmlFor="link" className="cursor-pointer">링크 (밑줄)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fullWidth" 
                checked={buttonStyle.buttonTypes.includes('fullWidth')}
                onCheckedChange={() => toggleButtonType('fullWidth')}
              />
              <Label htmlFor="fullWidth" className="cursor-pointer">가로 확장 (100% 너비)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="shiny" 
                checked={buttonStyle.buttonTypes.includes('shiny')}
                onCheckedChange={() => toggleButtonType('shiny')}
              />
              <Label htmlFor="shiny" className="cursor-pointer">반짝이는 버튼 (애니메이션)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="grow" 
                checked={buttonStyle.buttonTypes.includes('grow')}
                onCheckedChange={() => toggleButtonType('grow')}
              />
              <Label htmlFor="grow" className="cursor-pointer">확대 버튼 (호버 시 5배 커짐)</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
