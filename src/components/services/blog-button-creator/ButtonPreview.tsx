
import React from "react";
import { ButtonStyle } from "./BlogButtonCreator";
import { ButtonAnimationStyles } from "./ButtonAnimationStyles";
import { PreviewButton } from "./PreviewButton";

interface ButtonPreviewProps {
  buttonStyle: ButtonStyle;
}

export function ButtonPreview({ buttonStyle }: ButtonPreviewProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-purple-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">버튼 미리보기</h3>
      
      <div className="bg-gray-100 rounded-md p-8 flex items-center justify-center min-h-[200px]">
        <ButtonAnimationStyles />
        <PreviewButton buttonStyle={buttonStyle} />
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        미리보기에서는 클릭이 작동하지 않습니다. 생성된 HTML 코드를 블로그에 붙여넣기 하면 링크가 활성화됩니다.
      </p>
    </div>
  );
}
