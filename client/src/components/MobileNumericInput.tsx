import * as React from "react";
import { cn } from "@/lib/utils";

interface MobileNumericInputProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  placeholder?: string;
  className?: string;
  label?: string;
}

export const MobileNumericInput = React.forwardRef<
  HTMLInputElement,
  MobileNumericInputProps
>(({ id, value, onChange, min, max, placeholder, className, label }, ref) => {
  const [displayValue, setDisplayValue] = React.useState(value.toString());

  // Update display value when prop value changes
  React.useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // Allow empty value for better UX
    if (inputValue === '') {
      onChange(min);
      return;
    }

    // Parse and validate
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // Ensure valid value on blur
    const numValue = parseInt(displayValue, 10);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setDisplayValue(value.toString());
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text on focus for easy replacement
    e.target.select();
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        min={min}
        max={max}
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg text-center font-medium",
          "ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "touch-manipulation",
          "selection:bg-green-200 selection:text-green-900",
          className
        )}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{
          fontSize: '16px', // Prevent zoom on iOS
          WebkitAppearance: 'none',
          MozAppearance: 'textfield'
        }}
      />
    </div>
  );
});

MobileNumericInput.displayName = "MobileNumericInput";