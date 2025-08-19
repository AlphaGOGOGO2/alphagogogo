
import React from "react";
import { ButtonStyle, BlogButtonCreatorService } from "@/services/blogButtonCreatorService";
import { ButtonAnimationStyles } from "./ButtonAnimationStyles";
import { CodeDisplay } from "./components/CodeDisplay";

interface ButtonCodeDisplayProps {
  buttonStyle: ButtonStyle;
}

export function ButtonCodeDisplay({ buttonStyle }: ButtonCodeDisplayProps) {
  // 통합된 서비스를 사용하여 버튼 코드 생성
  const buttonResult = BlogButtonCreatorService.createButton(buttonStyle);

  return (
    <div className="space-y-4">
      <CodeDisplay code={buttonResult.code} />
      <ButtonAnimationStyles />
    </div>
  );
}
