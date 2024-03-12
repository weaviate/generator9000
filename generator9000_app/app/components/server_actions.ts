'use server'

import { DataField } from './types'

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PutObjectCommandInput } from "@aws-sdk/client-s3";

import OpenAI from "openai";

import fetch from 'node-fetch';
import { get_encoding } from "tiktoken";


const enc = get_encoding("gpt2");

async function downloadImageAsBase64(imageUrl: string) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    // Node.js buffer-based approach
    const buffer = await response.buffer();
    return `data:${response.headers.get('content-type')};base64,${buffer.toString('base64')}`;
}

export async function generateDataBasedPrompt(user_prompt: string, dataFields: DataField[], temperature: number, generationPod: string, set_env_key: string) {

    async function generateDataBasedPromptPromise(user_prompt: string, dataFields: DataField[], temperature: number, generationPod: string, set_env_key: string) {

        try {

            const openai: OpenAI = process.env.OPENAI_API_KEY ? new OpenAI() : new OpenAI({ apiKey: set_env_key });

            const fieldsDescription = dataFields.map(field => {
                let fieldDesc = `${field.name} (${field.type})`;
                if (field.values && field.values.length > 0) {
                    fieldDesc += ` with possible values: ${field.values.join(', ')}`;
                }
                return fieldDesc;
            }).join('; ');

            console.log(fieldsDescription)

            const prompt = `Given this prompt "${user_prompt}", generate synthetic data adhering to the following data field constraints: ${fieldsDescription}. Produce the output as non-nested JSON with field_name: value pairs, ensuring each value respects its field's type and possible values.`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                temperature: temperature,
                messages: [
                    { role: "system", content: prompt },
                ],
                response_format: { "type": "json_object" },
            });

            if (completion.choices[0].message.content) {
                const input_tokens = enc.encode(prompt);
                const output_tokens = enc.encode(completion.choices[0].message.content);

                const cost = (input_tokens.length * (0.01 / 1000)) + (output_tokens.length * (0.03 / 1000))

                return { "results": completion.choices[0].message.content, "costs": cost, "error": "" }
            } else {
                return { "results": "", "costs": "", "error": "No data was generated" }
            }

        } catch (error) {
            console.error("Error generating data:", error);
            return { "results": "", "costs": "", "error": error + "" }
        }
    }

    return {
        promise: generateDataBasedPromptPromise(user_prompt, dataFields, temperature, generationPod, set_env_key)
    }



}

export async function generateImageBasedDescription(image_description: string, prompt: string, size: "1024x1024" | "1792x1024" | "1024x1792", style: "vivid" | "natural", set_env_key: string): Promise<any> {

    async function generateImageBasedDescriptionPromise(image_description: string, prompt: string, size: "1024x1024" | "1792x1024" | "1024x1792", style: "vivid" | "natural", set_env_key: string) {
        const _prompt = prompt + " Based on this data and metainformation: " + image_description

        try {

            const openai: OpenAI = process.env.OPENAI_API_KEY ? new OpenAI() : new OpenAI({ apiKey: set_env_key });

            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: _prompt,
                n: 1,
                size: size,
                response_format: "url",
                style: style,
                quality: "hd"
            });

            if (response && response.data[0].url) {
                const imageUrl = response.data[0].url;
                const image_64 = await downloadImageAsBase64(imageUrl)

                if (imageUrl && image_64) {
                    return { "image": image_64, "url": imageUrl, "error": "" }
                } else {
                    return { "image": "", "url": "", "error": "No image was generated" }
                }


            } else {
                return { "image": "", "url": "", "error": "No image was generated" }
            }

        } catch (error) {
            console.log("Error when generating image " + error)
            return { "image": "", "url": "", "error": error + "" }
        }
    }

    return { promise: generateImageBasedDescriptionPromise(image_description, prompt, size, style, set_env_key) }


}

async function downloadImage(imageUrl: string) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return response.buffer(); // Return a buffer
}

export async function uploadToAWS(imageUrl: string, fileName: string) {

    async function uploadToAWSPromise(imageUrl: string, fileName: string) {
        const s3Client = new S3Client({
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', // Fallback to empty string if undefined
                secretAccessKey: process.env.AWS_ACCESS_SECRET || '', // Fallback to empty string if undefined
            }
        });

        const bucketName = process.env.AWS_BUCKET_NAME || 'default-bucket-name';
        const data = await downloadImage(imageUrl)

        if (data) {
            const params: PutObjectCommandInput = {
                Bucket: bucketName,
                Key: fileName + ".png",
                Body: data,
                ContentType: 'image/png',
            };

            try {
                // Using lib-storage to manage the upload
                const upload = new Upload({
                    client: s3Client,
                    params
                });

                const result = await upload.done();
                return result;
            } catch (error) {
                console.error("Upload failed", error);
                throw new Error("Failed to upload to AWS S3");
            }
        }
    }

    return { promise: uploadToAWSPromise(imageUrl, fileName) }
}