
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonType } from "../BlogButtonCreator";

interface ButtonTypeOption {
  id: ButtonType;
  label: string;
}

interface ButtonTypeGroupProps {
  selectedTypes: ButtonType[];
  onChange: (type: ButtonType) => void;
}

export function ButtonTypeGroup({ selectedTypes, onChange }: ButtonTypeGroupProps) {
  const buttonTypeOptions: ButtonTypeOption[] = [
    { id: 'primary', label: '기본 (채워진 배경)' },
    { id: 'outline', label: '아웃라인 (테두리만)' },
    { id: 'ghost', label: '고스트 (배경 없음)' },
    { id: 'link', label: '링크 (밑줄)' },
    { id: 'fullWidth', label: '가로 확장 (100% 너비)' },
    { id: 'shiny', label: '반짝이는 버튼 (애니메이션)' },
    { id: 'grow', label: '확대 버튼 (호버 시 5배 커짐)' }
  ];

  return (
    <div className="space-y-2 pt-2">
      <Label>버튼 스타일 (다중 선택 가능)</Label>
      <div className="flex flex-col space-y-3 mt-2">
        {buttonTypeOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={option.id} 
              checked={selectedTypes.includes(option.id)}
              onCheckedChange={() => onChange(option.id)}
            />
            <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
