import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { CalendarDays, User, Phone, Mail, Clock, AlertTriangle, Download, Eye } from "lucide-react";

interface Registration {
  id: number;
  clinicId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experienceLevel: string;
  horseName?: string;
  specialRequests?: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalConditions?: string;
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
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const { data: registrations = [], isLoading } = useQuery<Registration[]>({
    queryKey: ["/api/admin/registrations"],
  });

  const { data: clinics = [] } = useQuery({
    queryKey: ["/api/admin/clinics"],
  });

  const { data: refundCheck, isLoading: checkingRefund } = useQuery<RefundCheck>({
    queryKey: ["/api/admin/registrations", selectedRegistration?.id, "refund-check"],
    enabled: !!selectedRegistration && refundDialogOpen,
  });

  const cancelRegistrationMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      return await apiRequest("POST", `/api/admin/registrations/${id}/cancel`, { reason });
    },
    onSuccess: (data) => {
      toast({
        title: "Refund Processed",
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
        description: "Failed to process refund",
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

  // Group registrations by clinic
  const groupedRegistrations = registrations.reduce((groups, registration) => {
    const clinic = clinics.find((c: any) => c.id === registration.clinicId);
    const clinicName = clinic ? clinic.name : `Clinic ${registration.clinicId}`;
    
    if (!groups[clinicName]) {
      groups[clinicName] = [];
    }
    groups[clinicName].push(registration);
    return groups;
  }, {} as Record<string, Registration[]>);

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setDetailsDialogOpen(true);
  };

  const handleIssueRefund = (registration: Registration) => {
    setSelectedRegistration(registration);
    setRefundDialogOpen(true);
  };

  const handleCancelRegistration = () => {
    if (!selectedRegistration) return;
    
    cancelRegistrationMutation.mutate({
      id: selectedRegistration.id,
      reason: cancellationReason || "Cancelled by admin"
    });
  };

  const generateExcelReport = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/registrations/excel-export");
      const blob = new Blob([response], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clinic-registrations-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Excel Export",
        description: "Registration spreadsheet downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate Excel report",
        variant: "destructive",
      });
    }
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Clinic Registrations</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage clinic participants and process refunds
            </p>
          </div>
          <Button onClick={generateExcelReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>

        {Object.keys(groupedRegistrations).length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-gray-500 dark:text-gray-400">
              No registrations found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedRegistrations).map(([clinicName, clinicRegistrations]) => (
              <Card key={clinicName}>
                <CardHeader>
                  <CardTitle className="text-xl text-navy dark:text-blue-400">{clinicName}</CardTitle>
                  <CardDescription>
                    {clinicRegistrations.length} participant{clinicRegistrations.length !== 1 ? 's' : ''} registered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Horse</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinicRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto font-medium text-left"
                              onClick={() => handleViewDetails(registration)}
                            >
                              {registration.firstName} {registration.lastName}
                            </Button>
                            <div className="text-sm text-gray-500">{registration.email}</div>
                          </TableCell>
                          <TableCell>{registration.horseName || "N/A"}</TableCell>
                          <TableCell>{registration.experienceLevel}</TableCell>
                          <TableCell>{getStatusBadge(registration.status)}</TableCell>
                          <TableCell>{format(new Date(registration.registeredAt), "dd/MM/yyyy")}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(registration)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {registration.status === "confirmed" && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleIssueRefund(registration)}
                                >
                                  Issue Refund
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detailed View Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registration Details</DialogTitle>
              <DialogDescription>
                Full participant information
              </DialogDescription>
            </DialogHeader>
            
            {selectedRegistration && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Participant</Label>
                    <p>{selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Email</Label>
                    <p>{selectedRegistration.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Phone</Label>
                    <p>{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Experience Level</Label>
                    <p>{selectedRegistration.experienceLevel}</p>
                  </div>
                </div>

                {selectedRegistration.horseName && (
                  <div>
                    <Label className="font-medium">Horse Name</Label>
                    <p>{selectedRegistration.horseName}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Emergency Contact</Label>
                    <p>{selectedRegistration.emergencyContact || "Not provided"}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Emergency Phone</Label>
                    <p>{selectedRegistration.emergencyPhone || "Not provided"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                  </div>
                  <div>
                    <Label className="font-medium">Registered</Label>
                    <p>{format(new Date(selectedRegistration.registeredAt), "dd/MM/yyyy HH:mm")}</p>
                  </div>
                </div>

                {selectedRegistration.status === "cancelled_by_admin" && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Cancelled</span>
                    </div>
                    {selectedRegistration.cancellationReason && (
                      <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                        Reason: {selectedRegistration.cancellationReason}
                      </p>
                    )}
                    {selectedRegistration.refundAmount !== undefined && (
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Refund: £{(selectedRegistration.refundAmount / 100).toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Refund Dialog */}
        <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Refund</DialogTitle>
              <DialogDescription>
                Process refund request for {selectedRegistration?.firstName} {selectedRegistration?.lastName}
              </DialogDescription>
            </DialogHeader>

            {selectedRegistration && (
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
      </div>
    </div>
  );
}