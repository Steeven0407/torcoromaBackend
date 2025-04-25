import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dh3ioncwz",
  api_key: "832542251512329",
  api_secret: "vapgVKmNrQFX2ujXFyfDgFNrpnQ",
});

export const uploadImageE = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "EventosP",
  });
};

export const updateImageE = async (filePath, public_id) => {
  await cloudinary.uploader.destroy(public_id);
  return await cloudinary.uploader.upload(filePath, {
    folder: "EventosP",
  });
};

module.exports = cloudinary; 