import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string
    }
})

export const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET as string