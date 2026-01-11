import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SkillFormData {
  name: string;
  level: number;
  category: string;
}

interface SkillDialogProps {
  open: boolean;
  isEditing: boolean;
  isSubmitting: boolean;
  formData: SkillFormData;
  onOpenChange: (open: boolean) => void;
  onFormChange: (data: Partial<SkillFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SkillDialog({
  open,
  isEditing,
  isSubmitting,
  formData,
  onOpenChange,
  onFormChange,
  onSubmit,
}: SkillDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[calc(100vw-2rem)] sm:w-full">
        <form onSubmit={onSubmit}>
          <DialogHeader className="px-1">
            <DialogTitle className="text-lg sm:text-xl">
              {isEditing ? "Edit Skill" : "Add New Skill"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {isEditing
                ? "Update your skill information"
                : "Add a new skill to your portfolio"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Skill Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., React, TypeScript, Node.js"
                value={formData.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                required
                className="bg-background border-white/10 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm">
                Category *
              </Label>
              <Input
                id="category"
                placeholder="e.g., Frontend, Backend or DevOps"
                value={formData.category}
                onChange={(e) => onFormChange({ category: e.target.value })}
                required
                className="bg-background border-white/10 text-base"
              />
              <p className="text-xs text-muted-foreground">
                Use commas to add skill to multiple categories (e.g., "Frontend,
                Backend")
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="level" className="text-sm">
                  Proficiency Level
                </Label>
                <span className="text-sm font-mono text-primary font-bold">
                  {formData.level}%
                </span>
              </div>
              <Slider
                id="level"
                min={0}
                max={100}
                step={5}
                value={[formData.level]}
                onValueChange={(value) => onFormChange({ level: value[0] })}
                className="w-full touch-manipulation"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 px-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="cursor-pointer w-full sm:w-auto touch-manipulation"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 cursor-pointer w-full sm:w-auto touch-manipulation"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Skill"
              ) : (
                "Add Skill"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
