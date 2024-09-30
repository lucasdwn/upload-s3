import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadToS3 } from './upload';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).send({ error: 'No file uploaded' });
            return
        }

        // Faz o upload para o S3 e obtém a URL da imagem
        const imageUrl = await uploadToS3(req.file);

        // Retorna a URL da imagem no response
        res.status(200).send({ imageUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send({ error: 'Error uploading file' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
