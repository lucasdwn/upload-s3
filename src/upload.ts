import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

interface FileUpload {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
}

export const uploadToS3 = async (file: FileUpload): Promise<string> => {
    const key = `${uuidv4()}-${file.originalname}`;

    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read' as ObjectCannedACL,
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);
        return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
