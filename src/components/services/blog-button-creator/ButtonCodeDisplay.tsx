
import React from "react";
import { ButtonStyle } from "./BlogButtonCreator";
import { getButtonStyles, getButtonClass } from "./utils/buttonStyleUtils";
import { ButtonAnimationStyles } from "./ButtonAnimationStyles";
import { CodeDisplay } from "./components/CodeDisplay";
import { 
  styleToString, 
  generateCssStyles, 
  generateButtonCode 
} from "./utils/codeGenerationUtils";

interface ButtonCodeDisplayProps {
  buttonStyle: ButtonStyle;
}

export function ButtonCodeDisplay({ buttonStyle }: ButtonCodeDisplayProps) {
  // Get button styling
  const buttonStyles = getButtonStyles(buttonStyle);
  const buttonClass = getButtonClass(buttonStyle);
  
  // Convert styling to CSS strings
  const stylesString = styleToString(buttonStyles);
  const cssStyles = generateCssStyles(buttonStyle);
  
  // Generate the final button code
  const buttonCode = generateButtonCode(
    buttonStyle, 
    buttonClass, 
    stylesString, 
    cssStyles
  );

  return (
    <div className="space-y-4">
      <CodeDisplay code={buttonCode} />
      <ButtonAnimationStyles />
    </div>
  );
}
