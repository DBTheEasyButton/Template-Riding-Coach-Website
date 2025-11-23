import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Users, Wand2 } from "lucide-react";
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
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ClinicRegistration {
  id: number;
  firstName: string;
  lastName: string;
  horseName: string;
  skillLevel?: string;
  groupId?: number | null;
  status: string;
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
  participants: ClinicRegistration[];
}

interface GroupManagementProps {
  sessionId: number;
  sessionName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ParticipantCard({
  participant,
  isDragging,
}: {
  participant: ClinicRegistration;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: participant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-400 transition-colors"
      data-testid={`participant-card-${participant.id}`}
    >
      <div className="font-medium text-sm">{participant.firstName} {participant.lastName}</div>
      <div className="text-xs text-gray-600">{participant.horseName}</div>
      {participant.skillLevel && (
        <div className="text-xs text-gray-500 mt-1 capitalize">
          {participant.skillLevel}
        </div>
      )}
    </div>
  );
}

function GroupCard({
  group,
  onEdit,
  onDelete,
}: {
  group: ClinicGroup;
  onEdit: (group: ClinicGroup) => void;
  onDelete: (groupId: number) => void;
}) {
  const confirmedParticipants = group.participants.filter(
    (p) => p.status === "confirmed"
  );

  const { setNodeRef, isOver } = useDroppable({
    id: `group-${group.id}`,
    data: { groupId: group.id },
  });

  return (
    <Card 
      className={`mb-4 transition-colors border-2 ${isOver ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-400' : 'border-gray-300'}`}
      data-testid={`group-card-${group.id}`}
    >
      <CardHeader className="pb-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            {group.groupName}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(group)}
              data-testid={`button-edit-group-${group.id}`}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(group.id)}
              data-testid={`button-delete-group-${group.id}`}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-700 flex gap-4 mt-2 font-medium">
          {group.startTime && group.endTime && (
            <span className="flex items-center gap-1">
              ⏰ {group.startTime} - {group.endTime}
            </span>
          )}
          {group.skillLevel && (
            <span className="capitalize">📊 {group.skillLevel}</span>
          )}
          {group.maxParticipants && (
            <span>
              👥 {confirmedParticipants.length}/{group.maxParticipants}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="space-y-2 min-h-[100px]">
          <SortableContext
            items={confirmedParticipants.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {confirmedParticipants.length === 0 ? (
              <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-lg">
                Drag participants here
              </div>
            ) : (
              confirmedParticipants.map((participant) => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                />
              ))
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}

function UnassignedParticipants({
  participants,
}: {
  participants: ClinicRegistration[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
    data: { groupId: null },
  });

  return (
    <Card 
      className={`mb-4 border-2 border-yellow-400 bg-yellow-50 transition-colors ${isOver ? 'ring-2 ring-yellow-500 bg-yellow-100' : ''}`}
      data-testid="card-unassigned"
    >
      <CardHeader className="pb-3 bg-yellow-100">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Not Assigned ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={setNodeRef} className="space-y-2 min-h-[100px]">
          <SortableContext
            items={participants.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {participants.length === 0 ? (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-yellow-300 rounded-lg">
                Drag participants here to unassign them
              </div>
            ) : (
              participants.map((participant) => (
                <ParticipantCard key={participant.id} participant={participant} />
              ))
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GroupManagement({
  sessionId,
  sessionName,
  open,
  onOpenChange,
}: GroupManagementProps) {
  const { toast } = useToast();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ClinicGroup | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [newGroup, setNewGroup] = useState({
    groupName: "",
    skillLevel: "",
    maxParticipants: "",
    startTime: "",
    endTime: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: groupData, isLoading } = useQuery<{ groups: ClinicGroup[]; unassigned: ClinicRegistration[] }>({
    queryKey: [`/api/admin/sessions/${sessionId}/groups`],
    enabled: open,
  });

  const groups = groupData?.groups || [];
  const unassignedParticipants = groupData?.unassigned || [];

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: typeof newGroup) => {
      return apiRequest(
        "POST",
        `/api/admin/sessions/${sessionId}/groups`,
        groupData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/admin/sessions/${sessionId}/groups`],
      });
      setIsCreateGroupOpen(false);
      setNewGroup({ groupName: "", skillLevel: "", maxParticipants: "", startTime: "", endTime: "" });
      toast({ title: "Group created successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to create group",
        variant: "destructive",
      });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: async ({
      groupId,
      updates,
    }: {
      groupId: number;
      updates: Partial<ClinicGroup>;
    }) => {
      return apiRequest("PUT", `/api/admin/groups/${groupId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/admin/sessions/${sessionId}/groups`],
      });
      setEditingGroup(null);
      toast({ title: "Group updated successfully" });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: number) => {
      return apiRequest("DELETE", `/api/admin/groups/${groupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/admin/sessions/${sessionId}/groups`],
      });
      toast({ title: "Group deleted successfully" });
    },
  });

  const moveParticipantMutation = useMutation({
    mutationFn: async ({
      registrationId,
      groupId,
    }: {
      registrationId: number;
      groupId: number | null;
    }) => {
      return apiRequest(
        "POST",
        `/api/admin/registrations/${registrationId}/move`,
        { groupId }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/admin/sessions/${sessionId}/groups`],
      });
    },
  });

  const autoOrganizeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/admin/sessions/${sessionId}/auto-organize`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/admin/sessions/${sessionId}/groups`],
      });
      toast({ title: "Groups auto-organized successfully" });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeParticipantId = active.id as number;
    
    // Get target group ID from the droppable data
    let targetGroupId: number | null | undefined;
    
    // Check if dropped on a droppable zone (group or unassigned)
    if (over.data.current?.groupId !== undefined) {
      targetGroupId = over.data.current.groupId;
    } else {
      // Dropped on a participant - find which group it belongs to
      const overParticipantId = over.id as number;
      const overGroup = groups.find((g) =>
        g.participants.some((p) => p.id === overParticipantId)
      );
      
      // If the participant is in unassigned, set to null
      const isInUnassigned = unassignedParticipants.some(
        (p) => p.id === overParticipantId
      );
      
      targetGroupId = isInUnassigned ? null : overGroup?.id;
    }

    // Find source group
    const sourceGroup = groups.find((g) =>
      g.participants.some((p) => p.id === activeParticipantId)
    );
    const sourceGroupId = sourceGroup?.id || null;

    // Only move if target is different from source
    if (targetGroupId !== undefined && sourceGroupId !== targetGroupId) {
      moveParticipantMutation.mutate({
        registrationId: activeParticipantId,
        groupId: targetGroupId,
      });
    }
  };

  const handleCreateGroup = () => {
    if (!newGroup.groupName) {
      toast({
        title: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    createGroupMutation.mutate({
      ...newGroup,
      maxParticipants: newGroup.maxParticipants || "",
    });
  };

  const handleUpdateGroup = () => {
    if (!editingGroup) return;

    updateGroupMutation.mutate({
      groupId: editingGroup.id,
      updates: {
        groupName: editingGroup.groupName,
        skillLevel: editingGroup.skillLevel || null,
        maxParticipants: editingGroup.maxParticipants || null,
        startTime: editingGroup.startTime || null,
        endTime: editingGroup.endTime || null,
      },
    });
  };

  const activeParticipant = [
    ...groups.flatMap((g) => g.participants),
    ...unassignedParticipants
  ].find((p) => p.id === activeId);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Groups - {sessionName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setIsCreateGroupOpen(true)}
                data-testid="button-create-group"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
              <Button
                onClick={() => autoOrganizeMutation.mutate()}
                variant="outline"
                disabled={autoOrganizeMutation.isPending}
                data-testid="button-auto-organize"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Auto-Organize
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <UnassignedParticipants participants={unassignedParticipants} />

              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onEdit={setEditingGroup}
                  onDelete={(id) => deleteGroupMutation.mutate(id)}
                />
              ))}

              <DragOverlay>
                {activeParticipant && (
                  <ParticipantCard
                    participant={activeParticipant}
                    isDragging
                  />
                )}
              </DragOverlay>
            </DndContext>

            {groups.length === 0 && (
              <div className="text-center text-gray-500 py-12 border-2 border-dashed border-gray-300 rounded-lg">
                No groups created yet. Click "Create Group" to get started.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent data-testid="dialog-create-group">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                value={newGroup.groupName}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, groupName: e.target.value })
                }
                placeholder="e.g., Intermediate Jumping"
                data-testid="input-group-name"
              />
            </div>
            <div>
              <Label htmlFor="skillLevel">Skill Level (Optional)</Label>
              <Select
                value={newGroup.skillLevel}
                onValueChange={(value) =>
                  setNewGroup({ ...newGroup, skillLevel: value })
                }
              >
                <SelectTrigger data-testid="select-skill-level">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maxParticipants">Max Participants (Optional)</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={newGroup.maxParticipants}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, maxParticipants: e.target.value })
                }
                placeholder="e.g., 4"
                data-testid="input-max-participants"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time (Optional)</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newGroup.startTime}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, startTime: e.target.value })
                  }
                  data-testid="input-start-time"
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time (Optional)</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newGroup.endTime}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, endTime: e.target.value })
                  }
                  data-testid="input-end-time"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateGroupOpen(false)}
              data-testid="button-cancel-create"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={createGroupMutation.isPending}
              data-testid="button-submit-create"
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingGroup && (
        <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
          <DialogContent data-testid="dialog-edit-group">
            <DialogHeader>
              <DialogTitle>Edit Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editGroupName">Group Name *</Label>
                <Input
                  id="editGroupName"
                  value={editingGroup.groupName}
                  onChange={(e) =>
                    setEditingGroup({
                      ...editingGroup,
                      groupName: e.target.value,
                    })
                  }
                  data-testid="input-edit-group-name"
                />
              </div>
              <div>
                <Label htmlFor="editSkillLevel">Skill Level (Optional)</Label>
                <Select
                  value={editingGroup.skillLevel || ""}
                  onValueChange={(value) =>
                    setEditingGroup({ ...editingGroup, skillLevel: value })
                  }
                >
                  <SelectTrigger data-testid="select-edit-skill-level">
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editMaxParticipants">
                  Max Participants (Optional)
                </Label>
                <Input
                  id="editMaxParticipants"
                  type="number"
                  value={editingGroup.maxParticipants || ""}
                  onChange={(e) =>
                    setEditingGroup({
                      ...editingGroup,
                      maxParticipants: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  data-testid="input-edit-max-participants"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStartTime">Start Time (Optional)</Label>
                  <Input
                    id="editStartTime"
                    type="time"
                    value={editingGroup.startTime || ""}
                    onChange={(e) =>
                      setEditingGroup({
                        ...editingGroup,
                        startTime: e.target.value || null,
                      })
                    }
                    data-testid="input-edit-start-time"
                  />
                </div>
                <div>
                  <Label htmlFor="editEndTime">End Time (Optional)</Label>
                  <Input
                    id="editEndTime"
                    type="time"
                    value={editingGroup.endTime || ""}
                    onChange={(e) =>
                      setEditingGroup({
                        ...editingGroup,
                        endTime: e.target.value || null,
                      })
                    }
                    data-testid="input-edit-end-time"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingGroup(null)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateGroup}
                disabled={updateGroupMutation.isPending}
                data-testid="button-submit-edit"
              >
                Update Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
