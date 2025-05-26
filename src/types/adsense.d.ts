
// Type declarations for Google AdSense
interface Window {
  adsbygoogle: any[] & {
    loaded?: boolean;
    push: (ad: any) => void;
  };
}
