import { cloudinary } from "../../lib/cloudinary";

const uploadImage = async (
	fileBuffer: Buffer,
	mimeType: string,
	folder: string = "ecoforge_images",
): Promise<string> => {
	const b64 = fileBuffer.toString("base64");
	const dataURI = `data:${mimeType};base64,${b64}`;

	const result = await cloudinary.uploader.upload(dataURI, {
		folder,
		resource_type: "auto",
		transformation: [
			{ width: 500, height: 500, crop: "fill", gravity: "face" },
			{ quality: "auto", fetch_format: "auto" },
		],
	});

	return result.secure_url;
};

export const mediaService = {
	uploadImage,
};
