'use server'

import weaviate, { WeaviateClient, ObjectsBatcher, ApiKey } from 'weaviate-ts-client';


export async function get_API_Status() {
    return !!process.env.OPENAI_API_KEY;
}

export async function connect_weaviate(_url: string, _key: string, openai_key: string) {

    console.log(_url)

    try {

        const client: WeaviateClient = weaviate.client({
            scheme: 'https',
            host: _url,
            apiKey: new ApiKey(_key),
            headers: { 'X-OpenAI-Api-Key': openai_key },  // Replace with your inference API key
        });

        let allClassDefinitions = await client.schema.getter().do();
        if (allClassDefinitions.classes) {
            const classNames = allClassDefinitions.classes.map(item => item.class);
            return { "classes": classNames, "error": "" }
        } else {
            return { "classes": [], "error": "" }
        }
    } catch (e) {
        console.log("Error fetching " + e)
        return { "classes": [], "error": "Error fetching " + e }
    }
}