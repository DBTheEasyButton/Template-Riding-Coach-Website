import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

export default function ConfirmClinicTimes() {
  const [, params] = useRoute("/confirm-clinic-times/:token");
  const token = params?.token;
  
  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");
  const [firstName, setFirstName] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid confirmation link");
      return;
    }

    fetch(`/api/confirm-clinic-times/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFirstName(data.firstName || "");
          setStatus(data.alreadyConfirmed ? "already" : "success");
        } else {
          setStatus("error");
          setError(data.message || "Confirmation failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("Failed to confirm. Please try again later.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900">Confirming...</h1>
              <p className="text-gray-600 mt-2">Please wait while we process your confirmation.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Thank You{firstName ? `, ${firstName}` : ""}!</h1>
              <p className="text-gray-600 mt-3">
                Your confirmation has been recorded. We look forward to seeing you at the clinic!
              </p>
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm">
                  If you have any questions about your time slot, please contact Dan at dan@danbizzarromethod.com
                </p>
              </div>
            </>
          )}

          {status === "already" && (
            <>
              <CheckCircle className="w-20 h-20 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Already Confirmed!</h1>
              <p className="text-gray-600 mt-3">
                You've already confirmed receipt of your clinic times. We look forward to seeing you at the clinic!
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Confirmation Failed</h1>
              <p className="text-gray-600 mt-3">{error}</p>
              <p className="text-gray-500 mt-4 text-sm">
                If you're having trouble, please contact dan@danbizzarromethod.com
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
