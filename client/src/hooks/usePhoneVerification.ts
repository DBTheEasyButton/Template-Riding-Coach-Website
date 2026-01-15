import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface UsePhoneVerificationOptions {
  onVerified?: () => void;
  onError?: (error: string) => void;
}

interface PhoneVerificationState {
  isPhoneVerified: boolean;
  codeSent: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;
  verificationCode: string;
  verificationError: string;
}

interface UsePhoneVerificationReturn extends PhoneVerificationState {
  sendVerificationCode: (phone: string) => Promise<void>;
  verifyCode: (phone: string) => Promise<boolean>;
  setVerificationCode: (code: string) => void;
  handlePhoneChange: (phone: string) => void;
  markAsVerified: (phone: string) => void;
  reset: () => void;
  clearError: () => void;
}

export function usePhoneVerification(options: UsePhoneVerificationOptions = {}): UsePhoneVerificationReturn {
  const { toast } = useToast();
  const { onVerified, onError } = options;

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");

  const reset = useCallback(() => {
    setIsPhoneVerified(false);
    setCodeSent(false);
    setIsSendingCode(false);
    setIsVerifyingCode(false);
    setVerificationCode("");
    setVerificationError("");
    setVerifiedPhone("");
  }, []);
  
  const handlePhoneChange = useCallback((newPhone: string) => {
    if (isPhoneVerified && newPhone.trim() !== verifiedPhone.trim()) {
      reset();
    }
  }, [isPhoneVerified, verifiedPhone, reset]);

  const clearError = useCallback(() => {
    setVerificationError("");
  }, []);

  const sendVerificationCode = useCallback(async (phone: string) => {
    if (!phone.trim()) {
      toast({
        title: "Mobile Number Required",
        description: "Please enter your mobile number first.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingCode(true);
    setVerificationError("");

    try {
      const response = await fetch("/api/sms/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Failed to send code";
        setVerificationError(errorMsg);
        onError?.(errorMsg);
        toast({
          title: "Could Not Send Code",
          description: data.error || "Please check your number and try again.",
          variant: "destructive",
        });
        return;
      }

      setCodeSent(true);
      toast({
        title: "Code Sent!",
        description: "Check your phone for the 6-digit verification code.",
      });
    } catch (error) {
      const errorMsg = "Failed to send verification code";
      setVerificationError(errorMsg);
      onError?.(errorMsg);
      toast({
        title: "Error",
        description: "Could not send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  }, [toast, onError]);

  const verifyCode = useCallback(async (phone: string): Promise<boolean> => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setVerificationError("Please enter the 6-digit code");
      return false;
    }

    setIsVerifyingCode(true);
    setVerificationError("");

    try {
      const response = await fetch("/api/sms/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: phone.trim(), 
          code: verificationCode.trim() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Invalid code";
        setVerificationError(errorMsg);
        onError?.(errorMsg);
        return false;
      }

      setIsPhoneVerified(true);
      setVerifiedPhone(phone.trim());
      
      // Invalidate visitor cache to refresh phoneVerifiedAt status
      queryClient.invalidateQueries({ queryKey: ['/api/visitor/me'] });
      
      onVerified?.();
      toast({
        title: "Phone Verified!",
        description: "Your mobile number has been verified.",
      });
      return true;
    } catch (error) {
      setVerificationError("Failed to verify code");
      onError?.("Failed to verify code");
      return false;
    } finally {
      setIsVerifyingCode(false);
    }
  }, [verificationCode, toast, onVerified, onError]);

  const handleSetVerificationCode = useCallback((code: string) => {
    const cleanCode = code.replace(/\D/g, '');
    setVerificationCode(cleanCode);
    setVerificationError("");
  }, []);

  const markAsVerified = useCallback((phone: string) => {
    setIsPhoneVerified(true);
    setVerifiedPhone(phone.trim());
    onVerified?.();
  }, [onVerified]);

  return {
    isPhoneVerified,
    codeSent,
    isSendingCode,
    isVerifyingCode,
    verificationCode,
    verificationError,
    sendVerificationCode,
    verifyCode,
    setVerificationCode: handleSetVerificationCode,
    handlePhoneChange,
    markAsVerified,
    reset,
    clearError,
  };
}
