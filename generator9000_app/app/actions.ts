'use server'

import weaviate, { WeaviateClient, ObjectsBatcher, ApiKey } from 'weaviate-ts-client';
import { Template, DataField } from './components/types'
import { cookies } from 'next/headers'

export async function clear_weaviate_cookies() {

    cookies().delete('weaviate_url')
    cookies().delete('weaviate_key')

}

export async function get_API_Status() {

    const cookieStore = cookies()
    const api_cookie = cookieStore.get('Generator9000_APIKEY')?.value

    if (api_cookie) {
        return true
    } else {
        return !!process.env.OPENAI_API_KEY;
    }
}

export async function set_api_key(api: string) {
    cookies().set({
        name: 'Generator9000_APIKEY',
        value: api,
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: "strict",
        maxAge: 3600
    })
}

export async function remove_api_key() {
    cookies().delete('Generator9000_APIKEY')
}

export async function connect_weaviate(_url: string, _key: string) {
    try {

        const cookieStore = cookies()
        const openai_key = cookieStore.get('Generator9000_APIKEY')?.value || process.env.OPENAI_API_KEY || ""
        const cookie_url = cookieStore.get('weaviate_url')?.value || process.env.WEAVIATE_URL || ""
        const cookie_key = cookieStore.get('weaviate_key')?.value || process.env.WEAVIATE_API_KEY || ""

        let choosen_url = _url
        let choosen_key = _key

        if (_key === "" || _url === "") {
            if (cookie_url && cookie_key) {
                choosen_url = cookie_url
                choosen_key = cookie_key
            } else {
                return { "templates": [], "error": "", "connected": false };
            }
        }

        const client: WeaviateClient = weaviate.client({
            scheme: 'https',
            host: choosen_url,
            apiKey: new ApiKey(choosen_key),
            headers: { 'X-OpenAI-Api-Key': openai_key },
        });

        let allClassDefinitions = await client.schema.getter().do();

        // Initialize templates array with the "Create new" template at the beginning
        let templates: Template[] = [{
            name: "New Collection",
            prompt: "",
            imagePrompt: "",
            datafields: []
        }];

        if (allClassDefinitions.classes && allClassDefinitions.classes.length > 0) {
            // Generate templates for all class definitions
            const classTemplates = await Promise.all(
                allClassDefinitions.classes.map(classDef => createTemplate(client, classDef.class))
            );
            // Append the generated templates after the "Create new" template
            templates = templates.concat(classTemplates);
        }

        if (_key != "" || _url != "") {
            cookies().set({
                name: 'weaviate_url',
                value: _url,
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: "strict",
                maxAge: 3600

            })
            cookies().set({
                name: 'weaviate_key',
                value: _key,
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: "strict",
                maxAge: 3600
            })
        }

        return { templates, "error": "", "connected": true };
    } catch (e) {
        console.error("Error fetching: " + e);
        return { "templates": [], "error": "Error fetching: " + e, "connected": false };
    }
}

export async function get_weaviate_data(collectionName: string, dataFields: DataField[], page: number) {
    try {

        const cookieStore = cookies()
        const openai_key = cookieStore.get('Generator9000_APIKEY')?.value || process.env.OPENAI_API_KEY || ""
        const _url = cookieStore.get('weaviate_url')?.value || process.env.WEAVIATE_URL || ""
        const _key = cookieStore.get('weaviate_key')?.value || process.env.WEAVIATE_API_KEY || ""

        const offset = 12 * (page - 1)
        const fields = dataFields.map(field => field.name).join(' ');

        const client: WeaviateClient = weaviate.client({
            scheme: 'https',
            host: _url,
            apiKey: new ApiKey(_key),
            headers: { 'X-OpenAI-Api-Key': openai_key },
        });

        const query = await client.graphql.get()
            .withClassName(collectionName)
            .withFields(fields + " _additional { id }")
            .withOffset(offset)
            .withLimit(12)
            .do()

        const count_result = await client
            .graphql
            .aggregate()
            .withClassName(collectionName)
            .withFields('meta { count }')
            .do();

        if (query && count_result) {

            const data = query["data"]["Get"][collectionName]
            const count = count_result["data"]["Aggregate"][collectionName][0]["meta"]["count"]

            data.forEach((item: any) => {
                // Check if the item does not have an 'id' key or if the 'id' key is somehow falsy
                if (!item.id) {
                    // If 'id' key is missing or falsy, set it using the '_additional' dictionary's 'id'
                    item.id = item._additional.id;
                }
            });


            if (data) {
                return { data: data, "error": "", count: count };
            } else {
                return { data: [], "error": "No data", count: 0 };
            }
        } else {
            return { data: [], "error": "No data", count: 0 };
        }

    } catch (e) {
        console.error("Error fetching: " + e);
        return { "data": [], "error": "Error fetching: " + e, count: 0 };
    }
}

function createPropertiesList(dictionary: any, selected_image_key: string) {
    let properties = [];

    for (const [key, value] of Object.entries(dictionary)) {
        let property: any = {
            name: key,
            dataType: getDataType(value), // Call a function to determine the dataType
        };

        // Check if the current key is the selected_image_key
        if (key === selected_image_key) {
            property.moduleConfig = {
                'text2vec-openai': { skip: true },
            };
            // Ensure dataType is ['text'] for the selected_image_key
            property.dataType = ['text'];
        }

        properties.push(property);
    }

    return properties;
}

function getDataType(value: any) {
    if (Array.isArray(value)) {
        // Check the first element to determine the type inside the array
        const elementType = typeof value[0];
        return elementType === 'string' ? ['text[]'] : ['number[]'];
    } else {
        return typeof value === 'string' ? ['text'] : ['number'];
    }
}

export async function import_weaviate_data(collectionName: string, data: any, selectedTemplate: string, selected_img: string, prompt: string, imagePrompt: string) {
    try {

        const cookieStore = cookies()
        const openai_key = cookieStore.get('Generator9000_APIKEY')?.value || process.env.OPENAI_API_KEY || ""
        const _url = cookieStore.get('weaviate_url')?.value || process.env.WEAVIATE_URL || ""
        const _key = cookieStore.get('weaviate_key')?.value || process.env.WEAVIATE_API_KEY || ""

        const client: WeaviateClient = weaviate.client({
            scheme: 'https',
            host: _url,
            apiKey: new ApiKey(_key),
            headers: { 'X-OpenAI-Api-Key': openai_key },
        });

        const schema = await client.schema.exists(collectionName);

        if (schema && selectedTemplate != "New Collection") {
            const result = await client.data
                .creator()
                .withClassName(collectionName)
                .withProperties(data)
                .do();


            if (result) {
                return { "error": "" }
            } else {
                return { "error": "Could not create new data object" }
            }
        } else if (!schema && selectedTemplate != collectionName) {

            const properties = createPropertiesList(data, selected_img)

            const new_schema = {
                class: collectionName,
                description: prompt + " / " + imagePrompt,
                vectorizer: 'text2vec-openai',
                properties: properties
            }

            const res = await client
                .schema.classCreator()
                .withClass(new_schema)
                .do();

            if (res) {
                const result = await client.data
                    .creator()
                    .withClassName(collectionName)
                    .withProperties(data)
                    .do();


                if (result) {
                    return { "error": "" }
                } else {
                    return { "error": "Could not create new data object" }
                }
            }

            return { "error": "Could not create a new schema" }

        } else {
            return { "error": "Schema " + collectionName + " already exists" };
        }



    } catch (e) {
        console.error("Error at importing: " + e);
        return { "error": "Error ingesting: " + e };
    }
}

async function createTemplate(client: WeaviateClient, className: any): Promise<Template> {
    const classDefinition = await client.schema.classGetter().withClassName(className).do();

    if (!classDefinition || !classDefinition.properties) {
        throw new Error(`Class definition not found or has no properties for className: ${className}`);
    }

    const dataFields: DataField[] = classDefinition.properties.map((prop: any) => ({
        id: prop.name,
        name: prop.name,
        type: Array.isArray(prop.dataType) ? prop.dataType.join(", ") : "unknown",
        values: [],
    }));

    const template: Template = {
        name: classDefinition.class || "",
        prompt: "Generate: " + classDefinition.description || "",
        imagePrompt: "Generate an image: " + classDefinition.description || "",
        datafields: dataFields,
    };

    return template;
}
