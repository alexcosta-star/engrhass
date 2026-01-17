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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType as any,
                    folder: "portfolio",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
