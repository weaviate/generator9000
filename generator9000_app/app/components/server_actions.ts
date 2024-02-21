'use server'

import { DataField } from './types'

import OpenAI from "openai";

const openai = new OpenAI();

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

function generateNumericSeed(): number {
    // Get the current datetime as a Unix timestamp (milliseconds since the Unix epoch)
    const now = Date.now();

    // Generate a random number. Here, we scale it to ensure it adds a significant but manageable random component
    const randomPart = Math.floor(Math.random() * 1000);

    // Combine the datetime and the random number to form the seed
    // Note: This simplistic approach just appends the random part to the timestamp, which should be sufficient for many use cases
    const seed = now * 1000 + randomPart;

    return seed;
}



export async function generateImageBasedPrompt(prompt: string, size: "1024x1024" | "1792x1024" | "1024x1792", style: "vivid" | "natural"): Promise<any> {
    try {
        console.log("Generating Image")
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
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
                return { "image": image_64, "url": imageUrl }
            } else {
                return { "image": "", "url": "" }
            }


        } else {
            return { "image": "", "url": "" }
        }

    } catch (error) {
        return error
    }
}

export async function generateImageDescription(imageUrl: string, dataFields: DataField[], temperature: number): Promise<any> {
    console.log("DESCRIBING DATA");
    try {
        const fieldsDescription = dataFields.map(field => {
            let fieldDesc = `${field.name} (${field.type})`;
            if (field.values && field.values.length > 0) {
                fieldDesc += ` with possible values: ${field.values.join(', ')}`;
            }
            return fieldDesc;
        }).join('; ');

        const prompt = `You are an optical description AI that receives an images and describes the image adhering to the following data field constraints: ${fieldsDescription}. Write a clear description of the image.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            temperature: temperature,
            messages: [
                { role: "system", content: prompt },
                {
                    role: "user",
                    content: JSON.stringify([
                        { type: "text", text: "Produce the JSON based on the provided image." },
                        {
                            type: "image_url",
                            image_url: { url: imageUrl } // Adjust based on the expected structure
                        }
                    ])
                },
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating data:", error);
        return error;
    }
}

export async function generateData(imageUrl: string, dataFields: DataField[], temperature: number): Promise<any> {
    console.log("GENERATING DATA");

    const image_description = await generateImageDescription(imageUrl, dataFields, temperature)

    if (image_description) {
        try {
            const fieldsDescription = dataFields.map(field => {
                let fieldDesc = `${field.name} (${field.type})`;
                if (field.values && field.values.length > 0) {
                    fieldDesc += ` with possible values: ${field.values.join(', ')}`;
                }
                return fieldDesc;
            }).join('; ');

            const prompt = `Given the image described as "${image_description}", generate synthetic data adhering to the following data field constraints: ${fieldsDescription}. Produce the output as JSON with field_name: value pairs, ensuring each value respects its field's type and possible values.`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                temperature: temperature,
                messages: [
                    { role: "system", content: prompt },
                ],
                response_format: { "type": "json_object" },
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Error generating data:", error);
            return error;
        }
    } else {
        return "{}"
    }
}


export async function generateDataBasedPrompt(user_prompt: string, dataFields: DataField[], temperature: number): Promise<any> {
    try {
        const fieldsDescription = dataFields.map(field => {
            let fieldDesc = `${field.name} (${field.type})`;
            if (field.values && field.values.length > 0) {
                fieldDesc += ` with possible values: ${field.values.join(', ')}`;
            }
            return fieldDesc;
        }).join('; ');

        const prompt = `Given this prompt "${user_prompt}", generate synthetic data adhering to the following data field constraints: ${fieldsDescription}. Produce the output as JSON with field_name: value pairs, ensuring each value respects its field's type and possible values.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            temperature: temperature,
            seed: generateNumericSeed(),
            messages: [
                { role: "system", content: prompt },
            ],
            response_format: { "type": "json_object" },
        });

        if (completion.choices[0].message.content) {
            const input_tokens = enc.encode(prompt);
            const output_tokens = enc.encode(completion.choices[0].message.content);

            const cost = (input_tokens.length * (0.01 / 1000)) + (output_tokens.length * (0.03 / 1000))

            return { "results": completion.choices[0].message.content, "costs": cost }
        } else {
            return { "results": "", "costs": "" }
        }

    } catch (error) {
        console.error("Error generating data:", error);
        return error;
    }

}

export async function generateImageBasedDescription(image_description: string, prompt: string, size: "1024x1024" | "1792x1024" | "1024x1792", style: "vivid" | "natural"): Promise<any> {

    const _prompt = prompt + " Based on this data and metainformation: " + image_description

    try {
        console.log("Generating Image")
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
                return { "image": image_64, "url": imageUrl }
            } else {
                return { "image": "", "url": "" }
            }


        } else {
            return { "image": "", "url": "" }
        }

    } catch (error) {
        return error
    }
}

