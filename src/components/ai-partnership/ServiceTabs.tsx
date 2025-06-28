
import { cn } from "@/lib/utils";

interface AIService {
  id: string;
  name: string;
  display_name: string;
  url_pattern: string;
  description: string;
  benefits: string[];
  is_active: boolean;
}

interface ServiceTabsProps {
  services: AIService[];
  selectedService: string;
  onServiceChange: (service: string) => void;
}

export function ServiceTabs({ services, selectedService, onServiceChange }: ServiceTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-8">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onServiceChange(service.name)}
          className={cn(
            "px-6 py-3 rounded-full font-medium transition-all duration-200",
            selectedService === service.name
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
          )}
        >
          {service.display_name}
        </button>
      ))}
    </div>
  );
}
