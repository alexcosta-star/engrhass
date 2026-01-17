import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary with the keys provided by the user
cloudinary.config({
    cloud_name: "dyq5zfd8x",
    api_key: "581885362162688",
    api_secret: "DYavVSuLj50e13v7CWS8N_XU1cY",
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const resourceType = (formData.get("resourceType") as string) || "auto";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType as any,
                    folder: "portfolio",
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary error:", error);
                        resolve(NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 }));
                    } else {
                        resolve(NextResponse.json(result));
                    }
                }
            );

            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Server error during upload" }, { status: 500 });
    }
}
