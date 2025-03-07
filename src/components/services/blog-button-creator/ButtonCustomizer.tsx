import React from "react";
import { ButtonStyle, ButtonType } from "./BlogButtonCreator";
import { TextInputGroup } from "./components/TextInputGroup";
import { ColorInputGroup } from "./components/ColorInputGroup";
import { SliderInputGroup } from "./components/SliderInputGroup";
import { SwitchInputGroup } from "./components/SwitchInputGroup";
import { ButtonTypeGroup } from "./components/ButtonTypeGroup";

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
        <TextInputGroup
          id="buttonText"
          label="버튼 텍스트"
          value={buttonStyle.text}
          onChange={(value) => handleChange('text', value)}
          placeholder="버튼에 표시할 텍스트"
        />
        
        <TextInputGroup
          id="buttonUrl"
          label="버튼 URL"
          value={buttonStyle.url}
          onChange={(value) => handleChange('url', value)}
          placeholder="https://example.com"
          type="url"
        />
        
        <ColorInputGroup
          id="backgroundColor"
          label="배경 색상"
          value={buttonStyle.backgroundColor}
          onChange={(value) => handleChange('backgroundColor', value)}
        />
        
        <ColorInputGroup
          id="textColor"
          label="텍스트 색상"
          value={buttonStyle.textColor}
          onChange={(value) => handleChange('textColor', value)}
        />
        
        <SliderInputGroup
          id="fontSize"
          label="폰트 크기"
          value={buttonStyle.fontSize}
          onChange={(value) => handleChange('fontSize', value)}
          min={10}
          max={32}
        />
        
        <SliderInputGroup
          id="borderRadius"
          label="테두리 둥글기"
          value={buttonStyle.borderRadius}
          onChange={(value) => handleChange('borderRadius', value)}
          min={0}
          max={24}
        />
        
        <SwitchInputGroup
          id="boxShadow"
          label="그림자 효과"
          checked={buttonStyle.boxShadow}
          onChange={(checked) => handleChange('boxShadow', checked)}
        />
        
        <SwitchInputGroup
          id="hoverEffect"
          label="호버 효과"
          checked={buttonStyle.hoverEffect}
          onChange={(checked) => handleChange('hoverEffect', checked)}
        />
        
        <ButtonTypeGroup
          selectedTypes={buttonStyle.buttonTypes}
          onChange={toggleButtonType}
        />
      </div>
    </div>
  );
}
