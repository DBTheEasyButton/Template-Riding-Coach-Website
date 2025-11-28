import { AlertCircle, Users } from "lucide-react";

interface ClinicCapacityWarningProps {
  currentParticipants: number;
  maxParticipants: number;
}

export default function ClinicCapacityWarning({ currentParticipants, maxParticipants }: ClinicCapacityWarningProps) {
  const spotsLeft = maxParticipants - currentParticipants;
  const isNearlyFull = spotsLeft <= 2;
  const isFull = spotsLeft <= 0;

  if (isFull) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <p className="text-red-900 font-semibold">This clinic is full</p>
          <p className="text-red-700 text-sm">Join the waitlist to be notified if a spot becomes available</p>
        </div>
      </div>
    );
  }

  if (isNearlyFull) {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-amber-900 font-semibold">Only {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left!</p>
          <p className="text-amber-700 text-sm">Book quickly to secure your place</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6 flex items-center gap-3">
      <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <div>
        <p className="text-blue-900 font-semibold">{spotsLeft} spots available</p>
        <p className="text-blue-700 text-sm">{currentParticipants} of {maxParticipants} participants registered</p>
      </div>
    </div>
  );
}
