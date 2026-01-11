import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SettingsForm } from "@/components/dashboard/settings/SettingsForm";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const [formData, setFormData] = useState({
    githubUrl: "",
    linkedinUrl: "",
    resumeUrl: "",
    email: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        githubUrl: settings.githubUrl || "",
        linkedinUrl: settings.linkedinUrl || "",
        resumeUrl: settings.resumeUrl || "",
        email: settings.email || "",
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Settings
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Configure your social media links and contact information
          </p>
        </div>

        <SettingsForm
          formData={formData}
          isSubmitting={updateMutation.isPending}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}
