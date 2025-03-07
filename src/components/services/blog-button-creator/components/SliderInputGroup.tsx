
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SliderInputGroupProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function SliderInputGroup({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "px"
}: SliderInputGroupProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex justify-between">
        <span>{label}: {value}{unit}</span>
      </Label>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
        className="py-2"
      />
    </div>
  );
}
