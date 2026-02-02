import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Clock, Users, UserPlus, GripVertical, ChevronDown, ChevronUp, AlertCircle, Plus, ArrowUpDown, Trash2, X, Mail, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KeyRequest {
  type: 'time' | 'groupWith' | 'other';
  text: string;
  originalText: string;
  matchedNames?: string[];
}

interface ClinicRegistration {
  id: number;
  firstName: string;
  lastName: string;
  horseName: string;
  skillLevel?: string;
  groupId?: number | null;
  status: string;
  specialRequests?: string | null;
  keyRequests?: KeyRequest[];
  unassignedReason?: string | null;
  suggestedGroupId?: number | null;
  suggestionText?: string | null;
}

interface ClinicGroup {
  id: number;
  sessionId: number;
  groupName: string;
  skillLevel?: string | null;
  maxParticipants?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  displayOrder: number;
  schedulingNote?: string | null;
  participants: ClinicRegistration[];
}

interface ClinicSession {
  id: number;
  sessionName: string;
  discipline: string;
  skillLevel: string;
  groups: ClinicGroup[];
}

interface ClinicGroupsData {
  sessions: ClinicSession[];
  unassigned: ClinicRegistration[];
  allParticipants: ClinicRegistration[];
}

interface ClinicGroupsManagerProps {
  clinicId: number;
  clinicTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function parseKeyRequests(specialRequests: string | null | undefined, allParticipants: ClinicRegistration[]): KeyRequest[] {
  if (!specialRequests) return [];
  
  const requests: KeyRequest[] = [];
  const text = specialRequests.toLowerCase();
  
  const timePatterns = [
    /(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:or\s*(?:after|before|later|earlier))?/gi,
    /(?:earliest|first|morning|afternoon|late|early)\s*(?:slot|class|session|time)?/gi,
    /(?:can(?:'t| not)?|need to|have to)\s*(?:do|make|be there)?\s*(?:by|before|after|until)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/gi,
    /(\d{1,2}(?::\d{2})?\s*-\s*\d{1,2}(?::\d{2})?)\s*(?:pm|am)?/gi,
  ];
  
  for (const pattern of timePatterns) {
    const matches = specialRequests.match(pattern);
    if (matches) {
      for (const match of matches) {
        if (match.trim().length > 2) {
          requests.push({
            type: 'time',
            text: match.trim(),
            originalText: specialRequests
          });
        }
      }
    }
  }
  
  const groupWithPatterns = [
    /(?:with|same\s*(?:group|session)\s*as|together\s*with|put\s*me\s*with|travelling\s*with)\s+([a-z]+(?:\s+[a-z]+)?)/gi,
    /([a-z]+(?:\s+[a-z]+)?)\s+(?:and\s+I|we)\s+(?:are\s+)?(?:travelling|coming)\s+together/gi,
  ];
  
  const participantNames = allParticipants.map(p => ({
    full: `${p.firstName} ${p.lastName}`.toLowerCase(),
    first: p.firstName.toLowerCase(),
    last: p.lastName.toLowerCase(),
    id: p.id
  }));
  
  for (const pattern of groupWithPatterns) {
    let match;
    while ((match = pattern.exec(specialRequests)) !== null) {
      const mentionedName = match[1]?.toLowerCase().trim();
      if (mentionedName) {
        const matchedParticipants = participantNames.filter(p => 
          p.full.includes(mentionedName) || 
          p.first === mentionedName || 
          p.last === mentionedName ||
          mentionedName.includes(p.first) ||
          mentionedName.includes(p.last)
        );
        
        requests.push({
          type: 'groupWith',
          text: match[0].trim(),
          originalText: specialRequests,
          matchedNames: matchedParticipants.map(p => p.full)
        });
      }
    }
  }
  
  if (requests.length === 0 && specialRequests.trim().length > 0) {
    const hasTimeKeyword = /\d|am|pm|morning|afternoon|earliest|first|late|early|slot|session/i.test(specialRequests);
    const hasGroupKeyword = /with|together|same|travelling/i.test(specialRequests);
    
    if (hasTimeKeyword || hasGroupKeyword) {
      requests.push({
        type: hasGroupKeyword ? 'groupWith' : 'time',
        text: specialRequests.substring(0, 50) + (specialRequests.length > 50 ? '...' : ''),
        originalText: specialRequests
      });
    } else if (specialRequests.trim().length > 0) {
      requests.push({
        type: 'other',
        text: specialRequests.substring(0, 50) + (specialRequests.length > 50 ? '...' : ''),
        originalText: specialRequests
      });
    }
  }
  
  return requests;
}

// Helper to convert 24-hour time (15:00) to 12-hour format (3pm)
function formatTimeTo12Hour(time: string | null | undefined): string {
  if (!time) return 'TBD';
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr || '0');
  const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  const ampm = hour >= 12 ? 'pm' : 'am';
  if (minute === 0) {
    return `${hour12}${ampm}`;
  }
  return `${hour12}:${minuteStr}${ampm}`;
}

const skillLevelColors: Record<string, { bg: string; text: string; border: string }> = {
  beginner: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' },
  '70cm': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' },
  intermediate: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  '80cm': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  '90cm': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  advanced: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
  '1m': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
  '1.10m': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300' },
  '1.20m': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
  open: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300' },
};

function normalizeSkillLevel(level: string | null | undefined): string {
  if (!level) return 'Open';
  const l = level.toLowerCase().trim();
  if (l === 'beginner' || l === '70cm') return 'Beginner';
  if (l === 'intermediate' || l === '80cm' || l === '90cm') return 'Intermediate';
  if (l === 'advanced' || l === '1m' || l === '1.10m' || l === '1.20m') return 'Advanced';
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function getSkillLevelColor(level: string | null | undefined) {
  if (!level) return skillLevelColors.open;
  return skillLevelColors[level.toLowerCase()] || skillLevelColors.open;
}

function ParticipantCard({
  participant,
  isDragging,
  allParticipants,
}: {
  participant: ClinicRegistration;
  isDragging?: boolean;
  allParticipants: ClinicRegistration[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: participant.id });
  const [showFullNotes, setShowFullNotes] = useState(false);
  
  const keyRequests = useMemo(() => 
    parseKeyRequests(participant.specialRequests, allParticipants),
    [participant.specialRequests, allParticipants]
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const levelColor = getSkillLevelColor(participant.skillLevel);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 bg-white border-2 rounded-lg cursor-move hover:border-blue-400 hover:shadow-md transition-all ${levelColor.border}`}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-1 text-gray-400 hover:text-gray-600">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">
              {participant.firstName} {participant.lastName}
            </span>
            {participant.skillLevel && (
              <Badge variant="outline" className={`text-xs ${levelColor.bg} ${levelColor.text} ${levelColor.border}`}>
                {normalizeSkillLevel(participant.skillLevel)}
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{participant.horseName}</div>
          
          {keyRequests.length > 0 && (
            <div className="mt-2 space-y-1">
              {keyRequests.map((req, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  {req.type === 'time' && (
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-300 whitespace-normal text-left">
                      <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                      {req.text}
                    </Badge>
                  )}
                  {req.type === 'groupWith' && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 border-purple-300 whitespace-normal text-left">
                      <UserPlus className="w-3 h-3 mr-1 flex-shrink-0" />
                      {req.text}
                    </Badge>
                  )}
                  {/* Only show time and groupWith badges - skip "other" type (goals/general notes) */}
                  {req.type === 'other' && false && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-300 whitespace-normal text-left">
                      {req.text}
                    </Badge>
                  )}
                </div>
              ))}
              {participant.specialRequests && participant.specialRequests.length > 50 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullNotes(!showFullNotes);
                  }}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  {showFullNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showFullNotes ? 'Less' : 'Full notes'}
                </button>
              )}
              {showFullNotes && participant.specialRequests && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border mt-1">
                  {participant.specialRequests}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupCard({
  group,
  allParticipants,
  onDelete,
  onSwapWith,
  allGroups,
}: {
  group: ClinicGroup;
  allParticipants: ClinicRegistration[];
  onDelete: (groupId: number) => void;
  onSwapWith: (groupId1: number, groupId2: number) => void;
  allGroups: ClinicGroup[];
}) {
  const [showSwapMenu, setShowSwapMenu] = useState(false);
  const confirmedParticipants = group.participants.filter(p => p.status === "confirmed");
  const levelColor = getSkillLevelColor(group.skillLevel);

  const { setNodeRef, isOver } = useDroppable({
    id: `group-${group.id}`,
    data: { groupId: group.id },
  });

  const capacityWarning = group.maxParticipants && confirmedParticipants.length >= group.maxParticipants;
  const otherGroups = allGroups.filter(g => g.id !== group.id);

  return (
    <Card className={`transition-all ${isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''} ${levelColor.border} border-2`}>
      <CardHeader className={`pb-2 ${levelColor.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">{group.groupName}</CardTitle>
            {group.skillLevel && (
              <Badge className={`${levelColor.bg} ${levelColor.text} border ${levelColor.border} font-semibold`}>
                {group.skillLevel}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${capacityWarning ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white'}`}
            >
              <Users className="w-3 h-3 mr-1" />
              {confirmedParticipants.length}/{group.maxParticipants || '∞'}
            </Badge>
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setShowSwapMenu(!showSwapMenu)}
                title="Swap time slot with another group"
              >
                <ArrowUpDown className="w-3 h-3" />
              </Button>
              {showSwapMenu && (
                <div className="absolute right-0 top-7 z-50 bg-white border rounded-lg shadow-lg p-2 min-w-[180px]">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Swap time slot with:</div>
                  {otherGroups.length === 0 ? (
                    <div className="text-xs text-gray-400 py-2">No other groups</div>
                  ) : (
                    otherGroups.map(g => (
                      <button
                        key={g.id}
                        onClick={() => {
                          onSwapWith(group.id, g.id);
                          setShowSwapMenu(false);
                        }}
                        className="w-full text-left text-sm py-1.5 px-2 hover:bg-gray-100 rounded flex items-center justify-between"
                      >
                        <span>{g.groupName}</span>
                        <span className="text-xs text-gray-500">{formatTimeTo12Hour(g.startTime)}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(group.id)}
              title="Delete group"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {group.startTime && group.endTime && (
            <Badge variant="outline" className="text-xs bg-white">
              <Clock className="w-3 h-3 mr-1" />
              {formatTimeTo12Hour(group.startTime)} - {formatTimeTo12Hour(group.endTime)}
            </Badge>
          )}
        </div>
        {group.schedulingNote && (
          <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            {group.schedulingNote}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <div ref={setNodeRef} className="space-y-2 min-h-[80px]">
          <SortableContext
            items={confirmedParticipants.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {confirmedParticipants.length === 0 ? (
              <div className="text-center text-gray-400 py-6 border-2 border-dashed border-gray-200 rounded-lg text-sm">
                Drop participants here
              </div>
            ) : (
              confirmedParticipants.map(participant => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  allParticipants={allParticipants}
                />
              ))
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}

function UnassignedSection({
  participants,
  allParticipants,
  onMoveToGroup,
}: {
  participants: ClinicRegistration[];
  allParticipants: ClinicRegistration[];
  onMoveToGroup: (registrationId: number, groupId: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
    data: { groupId: null },
  });

  const confirmedUnassigned = participants.filter(p => p.status === "confirmed");

  return (
    <Card className={`border-2 border-yellow-400 ${isOver ? 'ring-2 ring-yellow-500 bg-yellow-100' : 'bg-yellow-50'}`}>
      <CardHeader className="pb-2 bg-yellow-100">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Not Assigned ({confirmedUnassigned.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div ref={setNodeRef} className="space-y-2 min-h-[80px]">
          <SortableContext
            items={confirmedUnassigned.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {confirmedUnassigned.length === 0 ? (
              <div className="text-center text-gray-500 py-6 border-2 border-dashed border-yellow-300 rounded-lg text-sm">
                All participants are assigned
              </div>
            ) : (
              confirmedUnassigned.map(participant => (
                <div key={participant.id} className="space-y-1">
                  <ParticipantCard
                    participant={participant}
                    allParticipants={allParticipants}
                  />
                  {participant.unassignedReason && (
                    <div className="ml-6 px-2 py-1.5 bg-orange-100 border border-orange-300 rounded text-xs text-orange-800">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{participant.unassignedReason}</span>
                      </div>
                      {participant.suggestedGroupId && participant.suggestionText && (
                        <div className="flex items-center gap-2 mt-1.5 ml-4">
                          <span className="text-gray-600">{participant.suggestionText}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                            onClick={() => onMoveToGroup(participant.id, participant.suggestedGroupId!)}
                          >
                            Yes
                          </Button>
                          <span className="text-gray-400 text-xs">or drag manually</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateGroupDialog({
  sessionId,
  onClose,
  onSuccess,
}: {
  sessionId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [groupName, setGroupName] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("4");

  const createGroupMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/admin/sessions/${sessionId}/groups`, {
        groupName: groupName || undefined,
        skillLevel: skillLevel || undefined,
        maxParticipants: parseInt(maxParticipants) || 4,
      });
    },
    onSuccess: () => {
      toast({ title: "Group created successfully" });
      onSuccess();
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to create group", variant: "destructive" });
    },
  });

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Group</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="groupName">Group Name (optional)</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="e.g., Group 1"
            />
          </div>
          <div>
            <Label htmlFor="skillLevel">Skill Level</Label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="open">Open (any level)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="maxParticipants">Max Participants</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              max="10"
              value={maxParticipants}
              onChange={e => setMaxParticipants(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button
              onClick={() => createGroupMutation.mutate()}
              disabled={createGroupMutation.isPending}
              className="flex-1"
            >
              {createGroupMutation.isPending ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClinicGroupsManager({
  clinicId,
  clinicTitle,
  open,
  onOpenChange,
}: ClinicGroupsManagerProps) {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { data, isLoading } = useQuery<ClinicGroupsData>({
    queryKey: [`/api/admin/clinics/${clinicId}/all-groups`],
    enabled: open,
  });

  const { data: emailConfirmations } = useQuery<Array<{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    confirmed: boolean;
    confirmedAt: string | null;
  }>>({
    queryKey: [`/api/admin/clinics/${clinicId}/email-confirmations`],
    enabled: open,
  });

  const sessions = data?.sessions || [];
  const unassignedParticipants = data?.unassigned || [];
  const allParticipants = data?.allParticipants || [];
  const allGroups = sessions.flatMap(s => s.groups);

  const moveParticipantMutation = useMutation({
    mutationFn: async ({ registrationId, groupId }: { registrationId: number; groupId: number | null }) => {
      return apiRequest("POST", `/api/admin/registrations/${registrationId}/move`, { groupId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/clinics/${clinicId}/all-groups`] });
    },
  });

  const smartOrganizeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/admin/clinics/${clinicId}/smart-organize`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/clinics/${clinicId}/all-groups`] });
      toast({ title: "Groups organized successfully", description: "Participants have been assigned based on skill level and special requests." });
    },
    onError: () => {
      toast({ title: "Failed to organize groups", variant: "destructive" });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: number) => {
      return apiRequest("DELETE", `/api/admin/groups/${groupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/clinics/${clinicId}/all-groups`] });
      toast({ title: "Group deleted", description: "Participants moved to unassigned." });
    },
    onError: () => {
      toast({ title: "Failed to delete group", variant: "destructive" });
    },
  });

  const swapTimesMutation = useMutation({
    mutationFn: async ({ groupId1, groupId2 }: { groupId1: number; groupId2: number }) => {
      return apiRequest("POST", `/api/admin/groups/swap-times`, { groupId1, groupId2 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/clinics/${clinicId}/all-groups`] });
      toast({ title: "Time slots swapped" });
    },
    onError: () => {
      toast({ title: "Failed to swap time slots", variant: "destructive" });
    },
  });

  const emailTimesMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/admin/clinics/${clinicId}/email-times`);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/clinics/${clinicId}/email-confirmations`] });
      toast({ 
        title: "Emails Sent", 
        description: data.message || `Emails sent to all participants.` 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to send emails", 
        description: error.message || "An error occurred",
        variant: "destructive" 
      });
    },
  });

  const handleDeleteGroup = (groupId: number) => {
    if (confirm("Delete this group? Participants will be moved to unassigned.")) {
      deleteGroupMutation.mutate(groupId);
    }
  };

  const handleSwapTimes = (groupId1: number, groupId2: number) => {
    swapTimesMutation.mutate({ groupId1, groupId2 });
  };

  // Auto-organize when dialog opens if there are unassigned participants but no groups
  const hasAutoOrganized = useRef(false);
  useEffect(() => {
    if (open && data && !hasAutoOrganized.current) {
      const hasGroups = sessions.some(s => s.groups.length > 0);
      const hasUnassigned = unassignedParticipants.length > 0;
      
      // Auto-organize if there are unassigned participants and no existing groups
      if (hasUnassigned && !hasGroups && !smartOrganizeMutation.isPending) {
        hasAutoOrganized.current = true;
        smartOrganizeMutation.mutate();
      }
    }
    // Reset the flag when dialog closes
    if (!open) {
      hasAutoOrganized.current = false;
    }
  }, [open, data, sessions, unassignedParticipants, smartOrganizeMutation]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeParticipantId = active.id as number;
    let targetGroupId: number | null | undefined;

    if (over.data.current?.groupId !== undefined) {
      targetGroupId = over.data.current.groupId;
    } else {
      const overParticipantId = over.id as number;
      const overGroup = allGroups.find(g => g.participants.some(p => p.id === overParticipantId));
      const isInUnassigned = unassignedParticipants.some(p => p.id === overParticipantId);
      targetGroupId = isInUnassigned ? null : overGroup?.id;
    }

    const sourceGroup = allGroups.find(g => g.participants.some(p => p.id === activeParticipantId));
    const sourceGroupId = sourceGroup?.id || null;

    if (targetGroupId !== undefined && sourceGroupId !== targetGroupId) {
      moveParticipantMutation.mutate({ registrationId: activeParticipantId, groupId: targetGroupId });
    }
  };

  const activeParticipant = [...allGroups.flatMap(g => g.participants), ...unassignedParticipants]
    .find(p => p.id === activeId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{clinicTitle}</h2>
            <p className="text-sm text-gray-600">Manage groups and participant assignments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => smartOrganizeMutation.mutate()}
              disabled={smartOrganizeMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {smartOrganizeMutation.isPending ? 'Organizing...' : 'Smart Organize'}
            </Button>
            <Button
              onClick={() => {
                if (confirm("Send clinic times email to all participants? They will receive the full schedule with their assigned time highlighted.")) {
                  emailTimesMutation.mutate();
                }
              }}
              disabled={emailTimesMutation.isPending || allParticipants.length === 0}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              {emailTimesMutation.isPending ? 'Sending...' : 'Email Times'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-6">
                <UnassignedSection 
                  participants={unassignedParticipants} 
                  allParticipants={allParticipants}
                  onMoveToGroup={(registrationId, groupId) => {
                    moveParticipantMutation.mutate({ registrationId, groupId });
                  }}
                />

                {/* Organize all groups by time slot */}
                {(() => {
                  // Collect all groups from all sessions
                  const allGroupsFlat = sessions.flatMap(s => 
                    s.groups.map(g => ({ ...g, sessionName: s.sessionName }))
                  );
                  
                  // Group by start time (or "Unscheduled" if no time)
                  const byTimeSlot = new Map<string, typeof allGroupsFlat>();
                  for (const group of allGroupsFlat) {
                    const timeKey = group.startTime || 'unscheduled';
                    if (!byTimeSlot.has(timeKey)) byTimeSlot.set(timeKey, []);
                    byTimeSlot.get(timeKey)!.push(group);
                  }
                  
                  // Sort time slots (scheduled first, then unscheduled)
                  const sortedTimeSlots = Array.from(byTimeSlot.entries()).sort((a, b) => {
                    if (a[0] === 'unscheduled') return 1;
                    if (b[0] === 'unscheduled') return -1;
                    return a[0].localeCompare(b[0]);
                  });
                  
                  return sortedTimeSlots.map(([timeSlot, groups]) => (
                    <div key={timeSlot} className="space-y-3">
                      <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-800">
                          {timeSlot === 'unscheduled' ? 'Time To Be Assigned' : timeSlot}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({groups.reduce((sum, g) => sum + g.participants.length, 0)} participants)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {groups.map(group => (
                          <GroupCard 
                            key={group.id} 
                            group={group} 
                            allParticipants={allParticipants}
                            onDelete={handleDeleteGroup}
                            onSwapWith={handleSwapTimes}
                            allGroups={allGroups}
                          />
                        ))}
                      </div>
                    </div>
                  ));
                })()}

                {sessions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {sessions.map(session => (
                      <Button
                        key={session.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateGroupDialog(session.id)}
                        className="border-dashed"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Group to {session.sessionName}
                      </Button>
                    ))}
                  </div>
                )}

                {sessions.length === 0 && (
                  <div className="text-center text-gray-500 py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    No sessions or groups configured for this clinic.
                  </div>
                )}
              </div>

              <DragOverlay>
                {activeParticipant && (
                  <div className="p-3 bg-white border-2 border-blue-400 rounded-lg shadow-lg">
                    <div className="font-medium text-sm">
                      {activeParticipant.firstName} {activeParticipant.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{activeParticipant.horseName}</div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>

        {/* Email Confirmation Status */}
        {emailConfirmations && emailConfirmations.length > 0 && (
          <div className="px-4 py-3 border-t bg-blue-50">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Email Confirmations</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  {emailConfirmations.filter(c => c.confirmed).length} confirmed
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <XCircle className="w-4 h-4" />
                  {emailConfirmations.filter(c => !c.confirmed).length} awaiting
                </span>
              </div>
            </div>
            {emailConfirmations.some(c => !c.confirmed) && (
              <div className="mt-2 text-xs text-gray-600">
                <span className="font-medium">Awaiting confirmation: </span>
                {emailConfirmations.filter(c => !c.confirmed).map(c => `${c.firstName} ${c.lastName}`).join(', ')}
              </div>
            )}
          </div>
        )}

        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" /> Time preference
            </span>
            <span className="flex items-center gap-1">
              <UserPlus className="w-3 h-3 text-purple-600" /> Group with request
            </span>
            <span className="flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Swap time slots
            </span>
            <span className="flex items-center gap-1">
              <Trash2 className="w-3 h-3 text-red-500" /> Delete group
            </span>
            <span>Drag participants to move them</span>
          </div>
        </div>
      </div>

      {showCreateGroupDialog !== null && (
        <CreateGroupDialog
          sessionId={showCreateGroupDialog}
          onClose={() => setShowCreateGroupDialog(null)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: [`/api/admin/clinics/${clinicId}/all-groups`] })}
        />
      )}
    </div>
  );
}
