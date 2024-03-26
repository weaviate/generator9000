'use server'

import weaviate, { WeaviateClient, ObjectsBatcher, ApiKey } from 'weaviate-ts-client';
import { Template, DataField } from './components/types'

export async function get_API_Status() {
    return !!process.env.OPENAI_API_KEY;
}

export async function connect_weaviate(_url: string, _key: string, openai_key: string) {
    try {
        const client: WeaviateClient = weaviate.client({
            scheme: 'https',
            host: _url,
            apiKey: new ApiKey(_key),
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
        return { templates, "error": "" };
    } catch (e) {
        console.log("Error fetching: " + e);
        return { "templates": [], "error": "Error fetching: " + e };
    }
}

function paginateArray<T>(array: T[], pageNumber: number, pageSize: number): T[] {
    // Calculate the starting index of the items to be returned
    const startIndex = (pageNumber - 1) * pageSize;
    // Use slice to extract a portion of the array starting from startIndex
    // and ending at startIndex + pageSize, without including the end element itself
    return array.slice(startIndex, startIndex + pageSize);
}

export async function get_weaviate_data(_url: string, _key: string, openai_key: string, collectionName: string, dataFields: DataField[], page: number) {
    try {

        const offset = 30 * page
        const fields = dataFields.map(field => field.name).join(' ');

        console.log("QUERY TIME with " + offset)

        const client: WeaviateClient = weaviate.client({
            scheme: 'https',
            host: _url,
            apiKey: new ApiKey(_key),
            headers: { 'X-OpenAI-Api-Key': openai_key },
        });

        const query = await client.graphql.get()
            .withClassName(collectionName)
            .withFields(fields)
            .withOffset(offset)
            .withLimit(30)
            .do()

        if (query) {

            const data = query["data"]["Get"][collectionName]

            if (data) {
                return { data: data, "error": "", count: data.length };
            } else {
                return { data: [], "error": "No data", count: 0 };
            }
        } else {
            return { data: [], "error": "No data", count: 0 };
        }

    } catch (e) {
        console.log("Error fetching: " + e);
        return { "data": [], "error": "Error fetching: " + e, count: 0 };
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