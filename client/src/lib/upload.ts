export async function uploadProjectImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload/project-preview", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Upload failed");
  }

  const data = await response.json();
  return data.url;
}
