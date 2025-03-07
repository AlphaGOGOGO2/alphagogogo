
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLink, Sparkle } from "lucide-react";

interface GPTSCardProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  colorClass?: string;
  buttonColorClass?: string;
  isHot?: boolean; // New prop to indicate if the card should have a HOT badge
}

export function GPTSCard({ 
  title, 
  description, 
  url, 
  imageUrl, 
  colorClass,
  buttonColorClass = "bg-purple-600 hover:bg-purple-700", // Default to purple if not specified
  isHot = false
}: GPTSCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow border border-gray-200 hover:border-purple-300 relative">
      {isHot && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-br-xl rounded-tl-xl shadow-md text-sm font-bold">
            <Sparkle size={16} className="animate-pulse" />
            HOT
          </div>
        </div>
      )}
      
      <CardHeader className={`p-6 pb-4 ${colorClass || "bg-white"}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-6 h-6 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-3 flex-grow">
        <p className="text-gray-600">{description}</p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition-colors bg-purple-600 hover:bg-purple-700"
        >
          이용하기
          <ExternalLink size={16} />
        </a>
      </CardFooter>
    </Card>
  );
}
