import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import PhoneNumberInput from "@/components/PhoneNumberInput";

interface PhoneVerificationFieldProps {
  mobile: string;
  setMobile: (value: string) => void;
  isPhoneVerified: boolean;
  codeSent: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  verificationCode: string;
  verificationError: string;
  onSendCode: () => void;
  onVerifyCode: () => void;
  onCodeChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  onReset: () => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  testIdPrefix?: string;
}

export function PhoneVerificationField({
  mobile,
  setMobile,
  isPhoneVerified,
  codeSent,
  isSendingCode,
  isVerifyingCode,
  verificationCode,
  verificationError,
  onSendCode,
  onVerifyCode,
  onCodeChange,
  onPhoneChange,
  onReset,
  disabled = false,
  label = "Mobile Number",
  placeholder = "07xxx xxxxxx",
  testIdPrefix = "phone",
}: PhoneVerificationFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${testIdPrefix}-mobile`} className="text-navy font-medium text-sm">
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="flex gap-2 items-start">
        <div className={`flex-1 ${isPhoneVerified ? '[&_input]:bg-green-50 [&_input]:border-green-300' : ''}`}>
          <PhoneNumberInput
            id={`${testIdPrefix}-mobile`}
            value={mobile}
            onChange={(newValue) => {
              setMobile(newValue);
              onPhoneChange(newValue);
            }}
            disabled={disabled || isPhoneVerified}
            data-testid={`input-${testIdPrefix}-mobile`}
          />
        </div>
        {!isPhoneVerified && (
          <Button
            type="button"
            onClick={onSendCode}
            disabled={isSendingCode || !mobile.trim() || mobile.length < 10 || disabled}
            variant={codeSent ? "outline" : "default"}
            className={`flex-shrink-0 ${codeSent ? "border-orange text-orange hover:bg-orange/10" : "bg-navy hover:bg-navy/90"}`}
            size="sm"
          >
            {isSendingCode ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : codeSent ? (
              "Resend"
            ) : (
              "Verify"
            )}
          </Button>
        )}
        {isPhoneVerified && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center text-green-600 px-1">
              <CheckCircle className="h-5 w-5" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={disabled}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Change
            </Button>
          </div>
        )}
      </div>
      
      {codeSent && !isPhoneVerified && (
        <div className="space-y-2 mt-2">
          <Label htmlFor={`${testIdPrefix}-verification-code`} className="text-navy font-medium text-sm">
            Enter the 6-digit code sent to your phone
          </Label>
          <div className="flex gap-2">
            <Input
              id={`${testIdPrefix}-verification-code`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => onCodeChange(e.target.value)}
              disabled={isVerifyingCode}
              className="border-gray-300 flex-1 text-center tracking-widest font-mono text-lg"
            />
            <Button
              type="button"
              onClick={onVerifyCode}
              disabled={isVerifyingCode || verificationCode.length !== 6}
              className="bg-orange hover:bg-orange-hover"
            >
              {isVerifyingCode ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
          {verificationError && (
            <p className="text-red-500 text-sm">{verificationError}</p>
          )}
        </div>
      )}
    </div>
  );
}
