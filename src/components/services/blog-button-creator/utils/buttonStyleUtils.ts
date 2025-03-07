
import { ButtonStyle } from "../BlogButtonCreator";
import { CSSProperties } from "react";

// Define a type for our button styles with all possible properties
export type ButtonStyleObj = {
  color: string;
  fontSize: string;
  borderRadius: string;
  padding: string;
  display: string;
  alignItems: string;
  justifyContent: string;
  fontWeight: string;
  textDecoration: string;
  fontFamily: string;
  cursor: string;
  transition: string;
  backgroundColor?: string;
  border?: string;
  boxShadow?: string;
  textUnderlineOffset?: string;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  overflow?: string;
  transform?: string;
  width?: string;
  animation?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  zIndex?: string;
};

// Generate CSS for the button based on current styles
export const getButtonStyles = (buttonStyle: ButtonStyle): CSSProperties => {
  // Create the initial styles object with the type
  let styles: ButtonStyleObj = {
    color: buttonStyle.textColor,
    fontSize: `${buttonStyle.fontSize}px`,
    borderRadius: `${buttonStyle.borderRadius}px`,
    padding: buttonStyle.padding,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'medium',
    textDecoration: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  // Apply styles based on button types
  const types = buttonStyle.buttonTypes;
  
  // Base appearance (primary, outline, ghost)
  if (types.includes('primary')) {
    styles = {
      ...styles,
      backgroundColor: buttonStyle.backgroundColor,
      border: 'none',
    };
  } else if (types.includes('outline')) {
    styles = {
      ...styles,
      backgroundColor: 'transparent',
      border: `2px solid ${buttonStyle.backgroundColor}`,
      color: buttonStyle.backgroundColor,
    };
  } else if (types.includes('ghost')) {
    styles = {
      ...styles,
      backgroundColor: 'transparent',
      border: 'none',
      color: buttonStyle.backgroundColor,
    };
  }
  
  // Link style
  if (types.includes('link')) {
    styles = {
      ...styles,
      backgroundColor: 'transparent',
      border: 'none',
      color: buttonStyle.backgroundColor,
      padding: '0',
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
    };
  }
  
  // Full Width
  if (types.includes('fullWidth')) {
    styles = {
      ...styles,
      width: '100%',
      padding: '12px 20px',
    };
  }
  
  // Shiny effect
  if (types.includes('shiny')) {
    styles = {
      ...styles,
      overflow: 'hidden',
      position: 'relative',
      zIndex: '1',
      backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)`,
      backgroundSize: '200% 100%',
      backgroundPosition: '-100% 0',
      animation: 'shiny 3s infinite linear',
    };
  }
  
  // Grow effect is handled with CSS classes
  if (types.includes('grow')) {
    styles = {
      ...styles,
      transform: 'scale(1)',
      transition: 'transform 0.3s ease',
    };
  }

  // Add box shadow if enabled
  if (buttonStyle.boxShadow && !types.includes('link')) {
    styles = {
      ...styles,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    };
  }

  return styles as CSSProperties;
};

// Get CSS class for the button based on type
export const getButtonClass = (buttonStyle: ButtonStyle): string => {
  let className = buttonStyle.hoverEffect ? "hover:opacity-90 " : "";
  
  if (buttonStyle.buttonTypes.includes('grow')) {
    className += "hover:scale-500 active:scale-400 transform transition-transform duration-300 ";
  }
  
  if (buttonStyle.buttonTypes.includes('shiny')) {
    className += "shiny-button ";
  }
  
  return className;
};
