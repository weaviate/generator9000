export interface DataField {
    id: string; // Unique identifier for each data field
    name: string;
    type: string;
    values: string[]; // Assuming values are stored as an array of strings
}

export interface Template {
    name: string;
    prompt: string;
    datafields: DataField[]; // Correctly type the datafields property here
}

export interface Templates {
    templates: Template[];
}

export const ecommerce_template: Template = {
    name: "E-Commerce Clothing",
    prompt: "Generate a product image of a clothing item for an e-commerce website in a flat layout and white background.",
    datafields: [{
        id: "name",
        name: "name",
        type: "string",
        values: [],
    },
    {
        id: "brand",
        name: "brand",
        type: "string",
        values: [],
    },
    {
        id: "gender",
        name: "gender",
        type: "string",
        values: ["male", "female", "unisex"],
    },
    {
        id: "price",
        name: "price",
        type: "number",
        values: [],
    }
    ]
}

export const cat_template: Template = {
    name: "Cat",
    prompt: "Generate an image of a cat.",
    datafields: [{
        id: "name",
        name: "name",
        type: "string",
        values: [],
    },
    {
        id: "color",
        name: "color",
        type: "string",
        values: [],
    },
    {
        id: "favorite_quote",
        name: "favorite_quote",
        type: "string[]",
        values: [],
    }
    ]
}

export const semanticlove_template: Template = {
    name: "Semantic Love",
    prompt: "Generate a persona for a dating platform, based on this JSON. Please return the same JSON.",
    datafields: [{
        id: "name",
        name: "person_name",
        type: "string",
        values: [],
    },
    {
        id: "age",
        name: "person_age",
        type: "number",
        values: [],
    },
    {
        id: "country",
        name: "country",
        type: "string",
        values: [],
    },
    {
        id: "gender",
        name: "gender",
        type: "string",
        values: ["male", "female", "other"],
    }
    ]
}

export const empty_template: Template = {
    name: "Empty",
    prompt: "",
    datafields: []
}

export interface FieldValues {
    [key: string]: string | null;
    imageBase64: string | null; // Now explicitly required but can be null
}

export const initial_templates: Templates = { templates: [empty_template, ecommerce_template, semanticlove_template, cat_template] }
