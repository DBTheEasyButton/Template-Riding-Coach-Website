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
  // Primary markets at top
  { code: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "IE", dial: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  // Rest alphabetically
  { code: "AF", dial: "+93", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AL", dial: "+355", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", dial: "+213", name: "Algeria", flag: "🇩🇿" },
  { code: "AR", dial: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "AM", dial: "+374", name: "Armenia", flag: "🇦🇲" },
  { code: "AU", dial: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "AT", dial: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "AZ", dial: "+994", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BH", dial: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "BD", dial: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BY", dial: "+375", name: "Belarus", flag: "🇧🇾" },
  { code: "BE", dial: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "BR", dial: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "BG", dial: "+359", name: "Bulgaria", flag: "🇧🇬" },
  { code: "CA", dial: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "CL", dial: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "CN", dial: "+86", name: "China", flag: "🇨🇳" },
  { code: "CO", dial: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "HR", dial: "+385", name: "Croatia", flag: "🇭🇷" },
  { code: "CY", dial: "+357", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", dial: "+420", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", dial: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "EG", dial: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "EE", dial: "+372", name: "Estonia", flag: "🇪🇪" },
  { code: "FI", dial: "+358", name: "Finland", flag: "🇫🇮" },
  { code: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
  { code: "GE", dial: "+995", name: "Georgia", flag: "🇬🇪" },
  { code: "DE", dial: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "GR", dial: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "HK", dial: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "HU", dial: "+36", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", dial: "+354", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", dial: "+91", name: "India", flag: "🇮🇳" },
  { code: "ID", dial: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "IL", dial: "+972", name: "Israel", flag: "🇮🇱" },
  { code: "IT", dial: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "JP", dial: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "JO", dial: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", dial: "+7", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", dial: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "KW", dial: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "LV", dial: "+371", name: "Latvia", flag: "🇱🇻" },
  { code: "LB", dial: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "LT", dial: "+370", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", dial: "+352", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MY", dial: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "MT", dial: "+356", name: "Malta", flag: "🇲🇹" },
  { code: "MX", dial: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "MA", dial: "+212", name: "Morocco", flag: "🇲🇦" },
  { code: "NL", dial: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "NZ", dial: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "NG", dial: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "NO", dial: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "OM", dial: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "PK", dial: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "PE", dial: "+51", name: "Peru", flag: "🇵🇪" },
  { code: "PH", dial: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "PL", dial: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "PT", dial: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "QA", dial: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "RO", dial: "+40", name: "Romania", flag: "🇷🇴" },
  { code: "RU", dial: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "SA", dial: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "RS", dial: "+381", name: "Serbia", flag: "🇷🇸" },
  { code: "SG", dial: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "SK", dial: "+421", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", dial: "+386", name: "Slovenia", flag: "🇸🇮" },
  { code: "ZA", dial: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "KR", dial: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "ES", dial: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "SE", dial: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", dial: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "TW", dial: "+886", name: "Taiwan", flag: "🇹🇼" },
  { code: "TH", dial: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "TR", dial: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "UA", dial: "+380", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", dial: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "VN", dial: "+84", name: "Vietnam", flag: "🇻🇳" },
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
