import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Plus, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { SkillCard } from "@/components/dashboard/skills/SkillCard";
import { SkillDialog } from "@/components/dashboard/skills/SkillDialog";
import { DeleteSkillDialog } from "@/components/dashboard/skills/DeleteSkillDialog";
import { EmptySkillsState } from "@/components/dashboard/skills/EmptySkillsState";
import { type Skill } from "@shared/schema";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

const MOBILE_INITIAL_DISPLAY_COUNT = 6; // Show 6 skills initially on mobile

interface SkillFormData {
  name: string;
  level: number;
  category: string;
}

export default function Skills() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<number | null>(null);
  const [deleteSkillId, setDeleteSkillId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    level: 50,
    category: "Other",
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const createMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully.",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SkillFormData> }) =>
      updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Skill updated",
        description: "Your skill has been updated successfully.",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Skill deleted",
        description: "Your skill has been deleted successfully.",
      });
      setDeleteSkillId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderSkills,
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reorder skills",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const resetForm = () => {
    setFormData({ name: "", level: 50, category: "Other" });
    setEditingSkill(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category,
    });
    setEditingSkill(skill.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteSkillId(id);
  };

  const confirmDelete = () => {
    if (deleteSkillId) {
      deleteMutation.mutate(deleteSkillId);
    }
  };

  const handleFormChange = (data: Partial<SkillFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((skill) => skill.id === active.id);
      const newIndex = skills.findIndex((skill) => skill.id === over.id);

      const newSkills = arrayMove(skills, oldIndex, newIndex);

      // Optimistically update the UI
      queryClient.setQueryData(["skills"], newSkills);

      // Send the new order to the server
      const skillIds = newSkills.map((skill) => skill.id);
      reorderMutation.mutate(skillIds);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading">
              Skills
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Manage your technical skills and expertise
              {skills.length > 0 && (
                <span className="ml-1">({skills.length} total)</span>
              )}
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {skills.length === 0 ? (
          <EmptySkillsState onAddClick={() => setIsDialogOpen(true)} />
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={skills.map((s) => s.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {(isMobile && !showAll
                    ? skills.slice(0, MOBILE_INITIAL_DISPLAY_COUNT)
                    : skills
                  ).map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {isMobile && skills.length > MOBILE_INITIAL_DISPLAY_COUNT && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  className="cursor-pointer touch-manipulation gap-2"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show More ({skills.length -
                        MOBILE_INITIAL_DISPLAY_COUNT}{" "}
                      more)
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <SkillDialog
        open={isDialogOpen}
        isEditing={!!editingSkill}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        formData={formData}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      <DeleteSkillDialog
        open={deleteSkillId !== null}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(open) => !open && setDeleteSkillId(null)}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}
