// Cloudinary upload utility calling internal API

export interface UploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    resource_type: string;
}

export const uploadToCloudinary = async (
    file: File,
    resourceType: "image" | "raw" = "image"
): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceType", resourceType);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
    }

    return response.json();
};
