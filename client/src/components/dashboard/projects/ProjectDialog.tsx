import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Upload, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadProjectImage } from "@/lib/upload";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";
import * as React from "react";

const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().optional(),
  link: z.string().url("Must be a valid URL"),
  tags: z.string().optional(),
});

interface ProjectFormValues {
  title: string;
  description?: string;
  link: string;
  tags: string[];
  imageUrl: string;
  id?: number;
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProjectFormValues) => void;
  isPending: boolean;
  editingProject?: Project | null;
}

export function ProjectDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  editingProject,
}: ProjectDialogProps) {
  const { toast } = useToast();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      tags: "",
    },
  });

  // Update form when editing project changes
  React.useEffect(() => {
    if (editingProject) {
      form.reset({
        title: editingProject.title,
        description: editingProject.description || "",
        link: editingProject.link,
        tags: editingProject.tags.join(", "),
      });
      setUploadedImageUrl(editingProject.imageUrl);
    } else {
      form.reset({
        title: "",
        description: "",
        link: "",
        tags: "",
      });
      setUploadedImageUrl("");
    }
  }, [editingProject, form]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadProjectImage(file);
      setUploadedImageUrl(url);
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const tagsArray = values.tags
      ? values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    if (!uploadedImageUrl) {
      toast({
        title: "Image required",
        description: "Please upload a project preview image.",
        variant: "destructive",
      });
      return;
    }

    try {
      onSubmit({
        ...(editingProject && { id: editingProject.id }),
        title: values.title,
        description: values.description || "",
        link: values.link,
        tags: tagsArray,
        imageUrl: uploadedImageUrl,
      });

      // Reset form and state
      form.reset();
      setUploadedImageUrl("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card border-white/10 max-h-[90vh] overflow-y-auto w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader className="px-1">
          <DialogTitle className="text-lg sm:text-xl">
            {editingProject ? "Edit Project" : "Add New Project"}{" "}
            <span className="text-red-500">*</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {editingProject
              ? "Update your project details and preview image."
              : "Create a new project to display on your portfolio. Upload an image and provide project details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 px-1"
          >
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project URL <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourproject.com"
                      {...field}
                      data-testid="input-link"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the live URL of your project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Project Preview Image <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {!uploadedImageUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-28 sm:h-32 border-dashed touch-manipulation"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Click to upload image
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Max 5MB • PNG, JPG, WEBP
                      </span>
                    </div>
                  )}
                </Button>
              ) : (
                <div className="relative aspect-video rounded-lg border border-white/10">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded preview"
                    className="object-contain w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={() => setUploadedImageUrl("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Project Name"
                      {...field}
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description..."
                      {...field}
                      data-testid="input-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, TypeScript, Tailwind"
                      {...field}
                      data-testid="input-tags"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                className="cursor-pointer w-full sm:w-auto touch-manipulation"
                type="submit"
                disabled={isPending || isUploading || !uploadedImageUrl}
                data-testid="button-submit"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingProject ? "Updating..." : "Creating..."}
                  </>
                ) : editingProject ? (
                  "Update Project"
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
