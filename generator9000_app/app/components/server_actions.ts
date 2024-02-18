'use server'

import { DataField, FieldValues } from './types'

import OpenAI from "openai";

const openai = new OpenAI();

export async function generateImage(prompt: string, size: string, style: string): Promise<any> {
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
            quality: "hd",
            style: "natural",
        });

        if (response) {
            return { "image": response.data[0].b64_json, "prompt": response.data[0].revised_prompt }
        } else {
            return { "image": "", "prompt": "" }
        }

    } catch (error) {
        return error
    }
}

export async function generateData(imageDescription: string, dataFields: DataField[], temperature: number): Promise<any> {
    console.log("GENERATING DATA");
    try {
        const fieldsDescription = dataFields.map(field => {
            let fieldDesc = `${field.name} (${field.type})`;
            if (field.values && field.values.length > 0) {
                fieldDesc += ` with possible values: ${field.values.join(', ')}`;
            }
            return fieldDesc;
        }).join('; ');

        const prompt = `Given the image described as "${imageDescription}", generate synthetic data adhering to the following data field constraints: ${fieldsDescription}. Produce the output as JSON with field_name: value pairs, ensuring each value respects its field's type and possible values.`;

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
}