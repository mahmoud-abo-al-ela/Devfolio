import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Linkedin, Mail, FileText, Save, Loader2 } from "lucide-react";

interface SettingsFormData {
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  email: string;
}

interface SettingsFormProps {
  formData: SettingsFormData;
  isSubmitting: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SettingsForm({
  formData,
  isSubmitting,
  onChange,
  onSubmit,
}: SettingsFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Card className="bg-card border-white/5">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">
            Social Media & Contact
          </CardTitle>
          <CardDescription className="text-sm">
            Update your social media profiles and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="githubUrl" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub URL
            </Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/username"
              value={formData.githubUrl}
              onChange={(e) => onChange("githubUrl", e.target.value)}
              className="bg-background border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn URL
            </Label>
            <Input
              id="linkedinUrl"
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedinUrl}
              onChange={(e) => onChange("linkedinUrl", e.target.value)}
              className="bg-background border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="bg-background border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resume URL
            </Label>
            <Input
              id="resumeUrl"
              type="url"
              placeholder="https://example.com/resume.pdf"
              value={formData.resumeUrl}
              onChange={(e) => onChange("resumeUrl", e.target.value)}
              className="bg-background border-white/10"
            />
            <p className="text-xs text-muted-foreground">
              Link to your resume (PDF, Google Drive, Dropbox, etc.)
            </p>
          </div>

          <div className="flex justify-end pt-4">
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
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
