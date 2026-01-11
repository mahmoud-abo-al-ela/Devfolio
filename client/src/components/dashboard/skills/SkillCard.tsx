import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { type Skill } from "@shared/schema";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
}

export function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="bg-card border-white/5 hover:border-primary/30 transition-colors"
    >
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex justify-between items-start gap-2">
          <button
            className="cursor-grab active:cursor-grabbing touch-none p-1.5 hover:bg-accent rounded touch-manipulation"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate">
              {skill.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {skill.category}
            </p>
          </div>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Button
              title="Edit"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(skill)}
              className="h-9 w-9 p-0 cursor-pointer touch-manipulation"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              title="Delete"
              variant="ghost"
              size="sm"
              onClick={() => onDelete(skill.id)}
              className="h-9 w-9 p-0 text-destructive hover:text-destructive cursor-pointer touch-manipulation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Proficiency</span>
            <span className="font-mono text-primary font-bold">
              {skill.level}%
            </span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
