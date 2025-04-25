import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dh3ioncwz",
  api_key: "832542251512329",
  api_secret: "vapgVKmNrQFX2ujXFyfDgFNrpnQ",
});

export const uploadImageG = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "GruposP",
  });
};

export const updateImageG = async (filePath, public_id) => {
  await cloudinary.uploader.destroy(public_id);
  return await cloudinary.uploader.upload(filePath, {
    folder: "GruposP",
  });
};

module.exports = cloudinary; 