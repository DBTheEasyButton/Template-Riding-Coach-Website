import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CountryCode {
  code: string;
  dial: string;
  name: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "IE", dial: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  { code: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
  { code: "DE", dial: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "ES", dial: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "IT", dial: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "NL", dial: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", dial: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "PT", dial: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "AU", dial: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", dial: "+64", name: "New Zealand", flag: "🇳🇿" },
];

interface PhoneNumberInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  "data-testid"?: string;
}

function parsePhoneNumber(fullNumber: string): { countryCode: string; nationalNumber: string } {
  if (!fullNumber) {
    return { countryCode: "+44", nationalNumber: "" };
  }

  const cleaned = fullNumber.replace(/\s+/g, "");

  for (const country of COUNTRY_CODES) {
    if (cleaned.startsWith(country.dial)) {
      return {
        countryCode: country.dial,
        nationalNumber: cleaned.substring(country.dial.length),
      };
    }
  }

  if (cleaned.startsWith("07") || cleaned.startsWith("7")) {
    const num = cleaned.startsWith("0") ? cleaned.substring(1) : cleaned;
    return { countryCode: "+44", nationalNumber: num };
  }

  return { countryCode: "+44", nationalNumber: cleaned.replace(/^0+/, "") };
}

export default function PhoneNumberInput({
  value,
  onChange,
  disabled = false,
  placeholder = "7700 900123",
  className = "",
  id,
  "data-testid": dataTestId,
}: PhoneNumberInputProps) {
  const parsed = parsePhoneNumber(value);
  const [countryCode, setCountryCode] = useState(parsed.countryCode);
  const [nationalNumber, setNationalNumber] = useState(parsed.nationalNumber);
  const [lastExternalValue, setLastExternalValue] = useState(value);

  useEffect(() => {
    if (value !== lastExternalValue) {
      const parsed = parsePhoneNumber(value);
      setCountryCode(parsed.countryCode);
      setNationalNumber(parsed.nationalNumber);
      setLastExternalValue(value);
    }
  }, [value, lastExternalValue]);

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    if (nationalNumber) {
      const newValue = newCode + nationalNumber;
      setLastExternalValue(newValue);
      onChange(newValue);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = e.target.value.replace(/[^0-9]/g, "");
    if (num.startsWith("0")) {
      num = num.substring(1);
    }
    setNationalNumber(num);
    const newValue = num ? countryCode + num : "";
    setLastExternalValue(newValue);
    onChange(newValue);
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.dial === countryCode) || COUNTRY_CODES[0];

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={countryCode} onValueChange={handleCountryChange} disabled={disabled}>
        <SelectTrigger className="w-[100px] flex-shrink-0 border-gray-300" data-testid={dataTestId ? `${dataTestId}-country` : undefined}>
          <SelectValue>
            <span className="flex items-center gap-1">
              <span>{selectedCountry.flag}</span>
              <span className="text-sm">{selectedCountry.dial}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((country) => (
            <SelectItem key={country.code} value={country.dial}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
                <span className="text-gray-500 ml-auto">{country.dial}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        placeholder={placeholder}
        value={nationalNumber}
        onChange={handleNumberChange}
        disabled={disabled}
        className="flex-1 border-gray-300"
        data-testid={dataTestId}
      />
    </div>
  );
}

export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return "";
  const { countryCode, nationalNumber } = parsePhoneNumber(phone);
  return `${countryCode} ${nationalNumber}`;
}

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const { nationalNumber } = parsePhoneNumber(phone);
  return nationalNumber.length >= 9 && nationalNumber.length <= 12;
}
