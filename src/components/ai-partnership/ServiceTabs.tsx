
import { cn } from "@/lib/utils";
import { AIPartnershipService } from "@/config/navigation";

interface ServiceTabsProps {
  services: AIPartnershipService[];
  selectedService: string;
  onServiceChange: (service: string) => void;
}

export function ServiceTabs({ services, selectedService, onServiceChange }: ServiceTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-8">
      {services.map((service) => (
        <button
          key={service.value}
          onClick={() => onServiceChange(service.value)}
          className={cn(
            "px-6 py-3 rounded-full font-medium transition-all duration-200",
            selectedService === service.value
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
          )}
        >
          {service.name}
        </button>
      ))}
    </div>
  );
}
