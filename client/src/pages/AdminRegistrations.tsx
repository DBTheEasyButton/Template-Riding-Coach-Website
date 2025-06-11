import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { CalendarDays, User, Phone, Mail, Clock, AlertTriangle } from "lucide-react";

interface Registration {
  id: number;
  clinicId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experienceLevel: string;
  horseName?: string;
  status: string;
  registeredAt: string;
  refundAmount?: number;
  refundProcessedAt?: string;
  cancellationReason?: string;
  paymentIntentId?: string;
}

interface RefundCheck {
  eligible: boolean;
  reason: string;
  amount?: number;
  adminFee?: number;
}

export default function AdminRegistrations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  const { data: registrations = [], isLoading } = useQuery<Registration[]>({
    queryKey: ["/api/admin/registrations"],
  });

  const { data: refundCheck, isLoading: checkingRefund } = useQuery<RefundCheck>({
    queryKey: ["/api/admin/registrations", selectedRegistration?.id, "refund-check"],
    enabled: !!selectedRegistration,
  });

  const cancelRegistrationMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      return await apiRequest("POST", `/api/admin/registrations/${id}/cancel`, { reason });
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Cancelled",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/registrations"] });
      setRefundDialogOpen(false);
      setSelectedRegistration(null);
      setCancellationReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to cancel registration",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled_by_admin":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "waitlist":
        return <Badge variant="outline">Waitlist</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCancelRegistration = () => {
    if (!selectedRegistration) return;
    
    cancelRegistrationMutation.mutate({
      id: selectedRegistration.id,
      reason: cancellationReason || "Cancelled by admin"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Registration Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage clinic registrations and process cancellations according to policy
          </p>
        </div>

        <div className="grid gap-6">
          {registrations.map((registration) => (
            <Card key={registration.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {registration.firstName} {registration.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {registration.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {registration.phone}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(registration.status)}
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {format(new Date(registration.registeredAt), "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="font-medium">Experience Level:</span>
                    <p className="text-gray-600 dark:text-gray-400">{registration.experienceLevel}</p>
                  </div>
                  {registration.horseName && (
                    <div>
                      <span className="font-medium">Horse:</span>
                      <p className="text-gray-600 dark:text-gray-400">{registration.horseName}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Clinic ID:</span>
                    <p className="text-gray-600 dark:text-gray-400">#{registration.clinicId}</p>
                  </div>
                </div>

                {registration.status === "cancelled_by_admin" && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Cancelled</span>
                    </div>
                    {registration.cancellationReason && (
                      <p className="text-red-700 dark:text-red-300 mt-1">
                        Reason: {registration.cancellationReason}
                      </p>
                    )}
                    {registration.refundAmount !== undefined && (
                      <p className="text-red-700 dark:text-red-300">
                        Refund: £{(registration.refundAmount / 100).toFixed(2)}
                      </p>
                    )}
                    {registration.refundProcessedAt && (
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Processed: {format(new Date(registration.refundProcessedAt), "dd/MM/yyyy HH:mm")}
                      </p>
                    )}
                  </div>
                )}

                {registration.status === "confirmed" && (
                  <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setSelectedRegistration(registration)}
                      >
                        Issue Refund
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Issue Refund</DialogTitle>
                        <DialogDescription>
                          Process refund request for {registration.firstName} {registration.lastName}
                        </DialogDescription>
                      </DialogHeader>

                      {selectedRegistration?.id === registration.id && (
                        <div className="space-y-4">
                          {checkingRefund ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                              <span>Checking refund eligibility...</span>
                            </div>
                          ) : refundCheck ? (
                            <div className={`p-3 rounded-lg ${refundCheck.eligible ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">
                                  {refundCheck.eligible ? 'Refund Eligible' : 'No Refund Available'}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{refundCheck.reason}</p>
                              {refundCheck.eligible && refundCheck.amount !== undefined && (
                                <div className="text-sm font-medium mt-2 space-y-1">
                                  <p>Refund Amount: £{(refundCheck.amount / 100).toFixed(2)}</p>
                                  {refundCheck.adminFee && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      (Original amount minus £{(refundCheck.adminFee / 100).toFixed(2)} admin fee)
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : null}

                          <div>
                            <Label htmlFor="reason">Cancellation Reason (Optional)</Label>
                            <Textarea
                              id="reason"
                              placeholder="Enter reason for cancellation..."
                              value={cancellationReason}
                              onChange={(e) => setCancellationReason(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setRefundDialogOpen(false);
                                setSelectedRegistration(null);
                                setCancellationReason("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleCancelRegistration}
                              disabled={cancelRegistrationMutation.isPending}
                            >
                              {cancelRegistrationMutation.isPending ? "Processing..." : "Process Refund"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))}

          {registrations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No registrations found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}