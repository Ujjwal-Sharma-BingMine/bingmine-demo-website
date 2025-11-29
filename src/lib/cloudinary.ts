import api from "./api"
import axios from "axios"

interface UploadTokenResponse {
    cloud_name: string
    api_key: string
    timestamp: number
    signature: string
    folder: string
}

export const uploadImageToCloudinary = async (file: File, type: "profile" | "banner"): Promise<string> => {
    try {
        console.log(`[Cloudinary] Requesting upload token for type: ${type}...`)
        // 1. Get signature from backend
        const { data: signatureData } = await api.get<UploadTokenResponse>("/profile/get-upload-token", {
            params: { type },
        })
        console.log("[Cloudinary] Token received:", signatureData)

        const { cloud_name, api_key, timestamp, signature, folder } = signatureData

        if (!cloud_name) {
            throw new Error("Missing cloud_name from upload token response")
        }

        // 2. Prepare FormData for Cloudinary
        const formData = new FormData()
        formData.append("file", file)
        formData.append("api_key", api_key)
        formData.append("timestamp", timestamp.toString())
        formData.append("signature", signature)
        formData.append("folder", folder)

        // 3. Upload to Cloudinary
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`
        console.log(`[Cloudinary] Uploading to: ${cloudinaryUrl}`)

        // Use standard axios (not our instance) to avoid auth headers conflict with Cloudinary
        const { data: uploadData } = await axios.post(cloudinaryUrl, formData)
        console.log("[Cloudinary] Upload success:", uploadData)

        return uploadData.secure_url
    } catch (error: any) {
        console.error("Cloudinary upload failed:", error)
        if (error.response) {
            console.error("Error Response Status:", error.response.status)
            console.error("Error Response Data:", error.response.data)
            console.error("Error Config URL:", error.config?.url)
        }
        throw new Error(error.response?.data?.message || "Failed to upload image")
    }
}
