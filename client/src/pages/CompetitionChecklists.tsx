import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, AlertTriangle, Calendar, MapPin, Plus, Download, Edit, Trash2 } from "lucide-react";
import type { CompetitionChecklist } from "@shared/schema";

export default function CompetitionChecklists() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newChecklist, setNewChecklist] = useState({
    competitionType: "",
    competitionName: "",
    competitionDate: "",
    location: "",
    horseName: ""
  });
  const [selectedChecklist, setSelectedChecklist] = useState<CompetitionChecklist | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: checklists = [] } = useQuery<CompetitionChecklist[]>({
    queryKey: ['/api/competition-checklists'],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: typeof newChecklist) => {
      console.log("Sending checklist data:", data);
      const response = await apiRequest("POST", "/api/competition-checklists/generate", data);
      const result = await response.json();
      console.log("Received checklist:", result);
      return result;
    },
    onSuccess: async (checklist) => {
      console.log("Checklist created successfully:", checklist);
      // Force refresh the checklists data
      await queryClient.invalidateQueries({ queryKey: ['/api/competition-checklists'] });
      await queryClient.refetchQueries({ queryKey: ['/api/competition-checklists'] });
      
      setSelectedChecklist(checklist);
      setNewChecklist({
        competitionType: "",
        competitionName: "",
        competitionDate: "",
        location: "",
        horseName: ""
      });
      toast({
        title: "Checklist Generated",
        description: "Your competition preparation checklist has been created successfully.",
      });
    },
    onError: (error) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate checklist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<CompetitionChecklist> }) => {
      const response = await apiRequest("PUT", `/api/competition-checklists/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/competition-checklists'] });
      toast({
        title: "Checklist Updated",
        description: "Changes saved successfully.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/competition-checklists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/competition-checklists'] });
      setSelectedChecklist(null);
      toast({
        title: "Checklist Deleted",
        description: "Checklist removed successfully.",
      });
    },
  });

  const handleGenerate = () => {
    if (!newChecklist.competitionType || !newChecklist.competitionName || !newChecklist.competitionDate || !newChecklist.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate a checklist.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    generateMutation.mutate(newChecklist, {
      onSettled: () => setIsGenerating(false)
    });
  };

  const handleTaskToggle = (checklistId: number, categoryKey: string, taskId: string, completed: boolean) => {
    if (!selectedChecklist) return;

    const checklistData = typeof selectedChecklist.checklist === 'string' 
      ? JSON.parse(selectedChecklist.checklist) 
      : selectedChecklist.checklist;

    const updatedChecklist = { ...checklistData };
    if (updatedChecklist[categoryKey]) {
      const taskIndex = updatedChecklist[categoryKey].findIndex((task: any) => task.id === taskId);
      if (taskIndex !== -1) {
        updatedChecklist[categoryKey][taskIndex].completed = completed;
      }
    }

    updateMutation.mutate({
      id: checklistId,
      updates: { checklist: JSON.stringify(updatedChecklist) }
    });

    setSelectedChecklist({
      ...selectedChecklist,
      checklist: updatedChecklist
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium": return <Clock className="w-4 h-4 text-orange-500" />;
      case "low": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50";
      case "medium": return "border-orange-200 bg-orange-50";
      case "low": return "border-green-200 bg-green-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getCompletionStats = (checklist: any) => {
    if (!checklist) return { completed: 0, total: 0 };
    
    const checklistData = typeof checklist === 'string' ? JSON.parse(checklist) : checklist;
    let completed = 0;
    let total = 0;

    Object.values(checklistData).forEach((tasks: any) => {
      if (Array.isArray(tasks)) {
        total += tasks.length;
        completed += tasks.filter((task: any) => task.completed).length;
      }
    });

    return { completed, total };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-playfair font-bold text-navy mb-6">Competition Preparation</h1>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Generate comprehensive, personalized checklists for your competitions. Stay organized and never miss a crucial preparation step.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checklist Generator */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="bg-gradient-to-r from-forest to-green-700 text-white">
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Generate New Checklist
                </CardTitle>
                <CardDescription className="text-green-100">
                  Create a customized preparation checklist for your upcoming competition
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="competitionType">Competition Level *</Label>
                  <Select value={newChecklist.competitionType} onValueChange={(value) => 
                    setNewChecklist({ ...newChecklist, competitionType: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select competition level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Novice">Novice</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Open Intermediate">Open Intermediate</SelectItem>
                      <SelectItem value="CCI3*">CCI3*</SelectItem>
                      <SelectItem value="CCI4*">CCI4*</SelectItem>
                      <SelectItem value="CCI5*">CCI5*</SelectItem>
                      <SelectItem value="Championship">Championship</SelectItem>
                      <SelectItem value="BYEH">BYEH</SelectItem>
                      <SelectItem value="Cotswold Cup">Cotswold Cup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="competitionName">Competition Name *</Label>
                  <Input
                    id="competitionName"
                    value={newChecklist.competitionName}
                    onChange={(e) => setNewChecklist({ ...newChecklist, competitionName: e.target.value })}
                    placeholder="e.g., Badminton Horse Trials"
                  />
                </div>

                <div>
                  <Label htmlFor="competitionDate">Competition Date *</Label>
                  <Input
                    id="competitionDate"
                    type="date"
                    value={newChecklist.competitionDate}
                    onChange={(e) => setNewChecklist({ ...newChecklist, competitionDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={newChecklist.location}
                    onChange={(e) => setNewChecklist({ ...newChecklist, location: e.target.value })}
                    placeholder="e.g., Badminton, England"
                  />
                </div>

                <div>
                  <Label htmlFor="horseName">Horse Name</Label>
                  <Input
                    id="horseName"
                    value={newChecklist.horseName}
                    onChange={(e) => setNewChecklist({ ...newChecklist, horseName: e.target.value })}
                    placeholder="Optional - horse name"
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="w-full bg-orange hover:bg-orange/90"
                >
                  {isGenerating ? "Generating..." : "Generate Checklist"}
                </Button>
              </CardContent>
            </Card>

            {/* Saved Checklists */}
            <Card className="shadow-lg border-gray-200 mt-6">
              <CardHeader>
                <CardTitle>Saved Checklists</CardTitle>
                <CardDescription>Your competition preparation checklists</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {checklists.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No checklists yet. Generate your first checklist above!</p>
                  ) : (
                    checklists.map((checklist) => {
                      const stats = getCompletionStats(checklist.checklist);
                      const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                      
                      return (
                        <div
                          key={checklist.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedChecklist?.id === checklist.id 
                              ? 'border-orange bg-orange/10' 
                              : 'border-gray-200 hover:border-orange/50'
                          }`}
                          onClick={() => setSelectedChecklist(checklist)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-navy">{checklist.competitionName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {checklist.competitionType}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(checklist.competitionDate.toString())}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {checklist.location}
                          </div>
                          {checklist.horseName && (
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <span className="w-4 h-4 mr-1">🐎</span>
                              {checklist.horseName}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {stats.completed}/{stats.total} tasks completed
                            </div>
                            <div className="text-xs font-medium text-forest">
                              {Math.round(progress)}%
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-forest h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checklist Display */}
          <div className="lg:col-span-2">
            {selectedChecklist ? (
              <Card className="shadow-lg border-gray-200">
                <CardHeader className="bg-gradient-to-r from-navy to-blue-800 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{selectedChecklist.competitionName}</CardTitle>
                      <div className="flex flex-wrap gap-4 text-blue-100">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(selectedChecklist.competitionDate.toString())}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedChecklist.location}
                        </div>
                        {selectedChecklist.horseName && (
                          <div className="flex items-center">
                            <span className="w-4 h-4 mr-1">🐎</span>
                            {selectedChecklist.horseName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white border-white hover:bg-white hover:text-navy"
                        onClick={() => {
                          // Download functionality could be added here
                          toast({
                            title: "Download",
                            description: "PDF download feature coming soon!",
                          });
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white border-white hover:bg-white hover:text-red-600"
                        onClick={() => deleteMutation.mutate(selectedChecklist.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {(() => {
                    console.log("Selected checklist raw data:", selectedChecklist);
                    console.log("Checklist type:", typeof selectedChecklist.checklist);
                    
                    let checklistData;
                    try {
                      checklistData = typeof selectedChecklist.checklist === 'string' 
                        ? JSON.parse(selectedChecklist.checklist) 
                        : selectedChecklist.checklist;
                      console.log("Parsed checklist data:", checklistData);
                    } catch (error) {
                      console.error("Error parsing checklist data:", error);
                      return <div className="text-red-500">Error loading checklist data</div>;
                    }

                    if (!checklistData || typeof checklistData !== 'object') {
                      console.error("Invalid checklist data structure:", checklistData);
                      return <div className="text-red-500">Invalid checklist data structure</div>;
                    }

                    return (
                      <div className="space-y-6">
                        {Object.entries(checklistData).map(([categoryKey, tasks]) => {
                          console.log("Processing category:", categoryKey, "with tasks:", tasks);
                          if (!Array.isArray(tasks)) {
                            console.warn("Tasks is not an array for category:", categoryKey, tasks);
                            return null;
                          }
                          return (
                            <div key={categoryKey} className="space-y-3">
                            <h3 className="text-xl font-playfair font-bold text-navy border-b border-gray-200 pb-2">
                              {categoryKey}
                            </h3>
                            <div className="space-y-2">
                              {(tasks as any[]).map((task) => (
                                <div
                                  key={task.id}
                                  className={`p-3 border rounded-lg ${getPriorityColor(task.priority)} ${
                                    task.completed ? 'opacity-60' : ''
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      checked={task.completed}
                                      onCheckedChange={(checked) => 
                                        handleTaskToggle(selectedChecklist.id, categoryKey, task.id, !!checked)
                                      }
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        {getPriorityIcon(task.priority)}
                                        <span className={`${task.completed ? 'line-through' : ''}`}>
                                          {task.task}
                                        </span>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {task.priority}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-gray-200 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">No Checklist Selected</h3>
                  <p>Generate a new checklist or select an existing one to view preparation tasks</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}