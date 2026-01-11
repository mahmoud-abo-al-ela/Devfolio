import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Plus } from "lucide-react";

interface EmptySkillsStateProps {
  onAddClick: () => void;
}

export function EmptySkillsState({ onAddClick }: EmptySkillsStateProps) {
  return (
    <Card className="bg-card border-white/5">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Code className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No skills yet</h3>
        <p className="text-muted-foreground text-center mb-6">
          Start adding your technical skills to showcase your expertise
        </p>
        <Button onClick={onAddClick} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Skill
        </Button>
      </CardContent>
    </Card>
  );
}
