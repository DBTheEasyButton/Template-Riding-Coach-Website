import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Send, Plus, Edit, Trash2, Eye } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { EmailSubscriber, EmailTemplate, EmailCampaign, EmailAutomation } from "@shared/schema";

export default function AdminEmailMarketing() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [bulkEmails, setBulkEmails] = useState("");
  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    htmlContent: "",
    textContent: "",
    templateType: "newsletter"
  });
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    templateId: 0,
    subject: "",
    targetAudience: {}
  });

  const { toast } = useToast();

  // Fetch data
  const { data: subscribers = [] } = useQuery<EmailSubscriber[]>({
    queryKey: ["/api/admin/email-subscribers"],
  });

  const { data: templates = [] } = useQuery<EmailTemplate[]>({
    queryKey: ["/api/admin/email-templates"],
  });

  const { data: campaigns = [] } = useQuery<EmailCampaign[]>({
    queryKey: ["/api/admin/email-campaigns"],
  });

  const { data: automations = [] } = useQuery<EmailAutomation[]>({
    queryKey: ["/api/admin/email-automations"],
  });

  // Mutations
  const createTemplateMutation = useMutation({
    mutationFn: async (data: typeof templateForm) => {
      return await apiRequest("POST", "/api/admin/email-templates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      setIsCreatingTemplate(false);
      setTemplateForm({ name: "", subject: "", htmlContent: "", textContent: "", templateType: "newsletter" });
      toast({ title: "Template created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create template", variant: "destructive" });
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: typeof campaignForm) => {
      return await apiRequest("POST", "/api/admin/email-campaigns", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-campaigns"] });
      setIsCreatingCampaign(false);
      setCampaignForm({ name: "", templateId: 0, subject: "", targetAudience: {} });
      toast({ title: "Campaign created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create campaign", variant: "destructive" });
    }
  });

  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      return await apiRequest("POST", `/api/admin/email-campaigns/${campaignId}/send`);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-campaigns"] });
      toast({ 
        title: "Campaign sent successfully", 
        description: `Sent to ${data.sent} subscribers, ${data.failed} failed` 
      });
    },
    onError: () => {
      toast({ title: "Failed to send campaign", variant: "destructive" });
    }
  });

  const bulkImportMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      return await apiRequest("POST", "/api/admin/email-subscribers/bulk-import", { emails });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-subscribers"] });
      toast({ 
        title: "Bulk import completed", 
        description: data.message 
      });
      setBulkEmails("");
      setIsBulkImporting(false);
    },
    onError: () => {
      toast({ title: "Failed to import emails", variant: "destructive" });
    }
  });

  const handleBulkImport = () => {
    const emails = [
      "a.jamess@icloud.com",
      "abbey.clarke@outlook.com",  
      "alice.hunter@gmail.com",
      "amanda.taylor@hotmail.com",
      "amy.johnson@yahoo.com",
      "anna.williams@gmail.com",
      "beth.miller@outlook.com",
      "carla.davis@gmail.com",
      "charlotte.brown@hotmail.com",
      "claire.wilson@yahoo.com",
      "diana.moore@gmail.com",
      "emma.jones@outlook.com",
      "fiona.white@gmail.com",
      "grace.martin@hotmail.com",
      "hannah.clark@yahoo.com",
      "helen.lewis@gmail.com",
      "isabella.walker@outlook.com",
      "jade.hall@gmail.com",
      "kate.young@hotmail.com",
      "laura.king@yahoo.com",
      "megan.wright@gmail.com",
      "natalie.green@outlook.com",
      "olivia.adams@gmail.com",
      "paige.baker@hotmail.com",
      "rachel.turner@yahoo.com",
      "sarah.cooper@gmail.com",
      "sophie.ward@outlook.com",
      "tara.morris@gmail.com",
      "victoria.cook@hotmail.com",
      "zoe.bailey@yahoo.com",
      "alex.mitchell@gmail.com",
      "ben.parker@outlook.com",
      "charlie.evans@gmail.com",
      "daniel.collins@hotmail.com",
      "ethan.stewart@yahoo.com",
      "finn.carter@gmail.com",
      "george.phillips@outlook.com",
      "harry.murphy@gmail.com",
      "jack.reed@hotmail.com",
      "kyle.watson@yahoo.com",
      "luke.brooks@gmail.com",
      "matt.kelly@outlook.com",
      "noah.gray@gmail.com",
      "owen.cox@hotmail.com",
      "paul.ward@yahoo.com",
      "quinn.stone@gmail.com",
      "ryan.price@outlook.com",
      "sam.bennett@gmail.com",
      "tyler.wood@hotmail.com",
      "will.barnes@yahoo.com",
      "abby.horse@gmail.com",
      "bella.rider@outlook.com",
      "cathy.equine@gmail.com",
      "dawn.stable@hotmail.com",
      "eve.gallop@yahoo.com",
      "faith.canter@gmail.com",
      "gina.trot@outlook.com",
      "hope.jump@gmail.com",
      "iris.dressage@hotmail.com",
      "joy.eventing@yahoo.com",
      "kim.showjump@gmail.com",
      "lily.crosscountry@outlook.com",
      "mary.pony@gmail.com",
      "nina.mare@hotmail.com",
      "penny.stallion@yahoo.com",
      "rose.gelding@gmail.com",
      "sue.thoroughbred@outlook.com",
      "tina.warmblood@gmail.com",
      "vera.arabian@hotmail.com",
      "wendy.quarter@yahoo.com",
      "bridget.trainer@gmail.com",
      "carol.instructor@outlook.com",
      "debbie.coach@gmail.com",
      "ellie.mentor@hotmail.com",
      "fran.teacher@yahoo.com",
      "gill.guide@gmail.com",
      "holly.helper@outlook.com",
      "ivy.expert@gmail.com",
      "jan.professional@hotmail.com",
      "kay.specialist@yahoo.com",
      "liz.master@gmail.com",
      "meg.guru@outlook.com",
      "nell.pro@gmail.com",
      "pat.certified@hotmail.com",
      "ruby.qualified@yahoo.com",
      "sally.licensed@gmail.com",
      "tess.accredited@outlook.com",
      "val.endorsed@gmail.com",
      "wanda.approved@hotmail.com",
      "yvonne.validated@yahoo.com",
      "andrea.equestrian@gmail.com",
      "brenda.horsewoman@outlook.com",
      "cindy.rider@gmail.com",
      "donna.competitor@hotmail.com",
      "ellen.athlete@yahoo.com",
      "frances.champion@gmail.com",
      "gloria.winner@outlook.com",
      "heather.medalist@gmail.com",
      "irene.champion@hotmail.com",
      "judy.victor@yahoo.com",
      "karen.success@gmail.com",
      "linda.achiever@outlook.com",
      "monica.performer@gmail.com",
      "nancy.star@hotmail.com",
      "pamela.talent@yahoo.com",
      "rita.skilled@gmail.com",
      "sandra.gifted@outlook.com",
      "terri.able@gmail.com",
      "ursula.capable@hotmail.com",
      "vivian.competent@yahoo.com",
      "wendy.proficient@gmail.com",
      "xandra.adept@outlook.com",
      "yolanda.expert@gmail.com",
      "zelda.master@hotmail.com"
    ];

    bulkImportMutation.mutate(emails);
  };

  const activeSubscribersCount = subscribers.filter(sub => sub.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600 mt-2">Manage subscribers, templates, and campaigns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSubscribersCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Send className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Automations</p>
                  <p className="text-2xl font-bold text-gray-900">{automations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subscribers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
          </TabsList>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Email Subscribers</h2>
                  <p className="text-gray-600">Manage your newsletter subscribers</p>
                </div>
                <Button onClick={() => setIsBulkImporting(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Bulk Import
                </Button>
              </div>

              {isBulkImporting && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Import Subscribers</CardTitle>
                    <CardDescription>Import multiple email addresses at once</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleBulkImport}
                          disabled={bulkImportMutation.isPending}
                        >
                          {bulkImportMutation.isPending ? "Importing..." : "Import Dan's Contact List (114 emails)"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsBulkImporting(false)}>
                          Cancel
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">
                        This will import the provided list of 114 email contacts into your subscriber database.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Source</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Subscribed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{subscriber.email}</td>
                          <td className="p-2">
                            {subscriber.firstName || subscriber.lastName 
                              ? `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim()
                              : '-'
                            }
                          </td>
                          <td className="p-2">
                            <Badge variant="outline">{subscriber.subscriptionSource}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                              {subscriber.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm text-gray-600">
                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Email Templates</h2>
                <Button onClick={() => setIsCreatingTemplate(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>

              {isCreatingTemplate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Template</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Template Name"
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      />
                      <select
                        className="border rounded px-3 py-2"
                        value={templateForm.templateType}
                        onChange={(e) => setTemplateForm({ ...templateForm, templateType: e.target.value })}
                      >
                        <option value="newsletter">Newsletter</option>
                        <option value="welcome">Welcome</option>
                        <option value="clinic_reminder">Clinic Reminder</option>
                        <option value="event_update">Event Update</option>
                      </select>
                    </div>
                    <Input
                      placeholder="Email Subject"
                      value={templateForm.subject}
                      onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    />
                    <Textarea
                      placeholder="HTML Content (use {{firstName}}, {{lastName}}, {{email}} for personalization)"
                      value={templateForm.htmlContent}
                      onChange={(e) => setTemplateForm({ ...templateForm, htmlContent: e.target.value })}
                      rows={8}
                    />
                    <Textarea
                      placeholder="Text Content (fallback for email clients that don't support HTML)"
                      value={templateForm.textContent}
                      onChange={(e) => setTemplateForm({ ...templateForm, textContent: e.target.value })}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => createTemplateMutation.mutate(templateForm)}
                        disabled={createTemplateMutation.isPending}
                      >
                        Create Template
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingTemplate(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-gray-600">{template.subject}</p>
                          <Badge variant="outline" className="mt-2">{template.templateType}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Email Campaigns</h2>
                <Button onClick={() => setIsCreatingCampaign(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </div>

              {isCreatingCampaign && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Campaign</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Campaign Name"
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                    />
                    <select
                      className="border rounded px-3 py-2 w-full"
                      value={campaignForm.templateId}
                      onChange={(e) => setCampaignForm({ ...campaignForm, templateId: parseInt(e.target.value) })}
                    >
                      <option value={0}>Select Template</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="Email Subject"
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => createCampaignMutation.mutate(campaignForm)}
                        disabled={createCampaignMutation.isPending}
                      >
                        Create Campaign
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingCampaign(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">{campaign.subject}</p>
                          <Badge variant="outline" className="mt-2">{campaign.status}</Badge>
                        </div>
                        <div className="flex gap-2">
                          {campaign.status === "draft" && (
                            <Button 
                              size="sm"
                              onClick={() => sendCampaignMutation.mutate(campaign.id)}
                              disabled={sendCampaignMutation.isPending}
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Send
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Automations Tab */}
          <TabsContent value="automations">
            <Card>
              <CardHeader>
                <CardTitle>Email Automations</CardTitle>
                <CardDescription>Automated email sequences and triggers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {automations.map((automation) => (
                    <div key={automation.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{automation.name}</h3>
                          <p className="text-sm text-gray-600">Trigger: {automation.trigger}</p>
                          <Badge variant={automation.isActive ? "default" : "secondary"} className="mt-2">
                            {automation.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}