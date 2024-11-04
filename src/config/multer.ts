import multer from 'multer';
import path from 'path';
import { bucket } from './firebase';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImageToFirebase = async (file: any) => {
  const fileName = Date.now() + path.extname(file.originalname);
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => {
      console.error('Erro no upload:', error);
      reject(error);
    });

    stream.on('finish', async () => {
      await fileUpload.makePublic();
      resolve(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      );
    });

    stream.end(file.buffer);
  });
};
