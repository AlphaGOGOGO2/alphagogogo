
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CodeDisplayProps {
  code: string;
  label?: string;
}

export function CodeDisplay({ code, label = "HTML 코드" }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800">{label}</h3>
        <Button
          variant="default"
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 mr-1" />
          ) : (
            <Copy className="h-4 w-4 mr-1" />
          )}
          {copied ? "복사됨" : "코드 복사"}
        </Button>
      </div>
      
      <Card className="relative">
        <pre className="p-4 text-sm overflow-x-auto bg-gray-50 rounded-lg text-gray-800 border border-gray-200">
          <code>{code}</code>
        </pre>
      </Card>
    </div>
  );
}
