export interface DataField {
    id: string; // Unique identifier for each data field
    name: string;
    type: string;
    values: string[]; // Assuming values are stored as an array of strings
}

export interface Template {
    name: string;
    prompt: string;
    imagePrompt: string;
    datafields: DataField[]; // Correctly type the datafields property here
}

export interface Templates {
    templates: Template[];
}

export const ecommerce_template: Template = {
    name: "E-Commerce Upper Body Clothing",
    prompt: "Generate a clothing item product for the upper body. It can be a sweater, t-shirt, jacket, or something similar.",
    imagePrompt: "Create a highly detailed and realistic image of a single clothing item, presented as if for an e-commerce website. The item should be either laid flat or hanging against a pure white background, with no additional items, decorations, or visual elements present. The clothing should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view suitable for online shopping.",
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
    },
    {
        id: "category",
        name: "category",
        type: "string",
        values: ["Clothing"],
    },
    {
        id: "short_description",
        name: "short_description",
        type: "string",
        values: [],
    },
    {
        id: "colors",
        name: "colors",
        type: "string[]",
        values: ["Red", "Blue", "Green", "White", "Black", "Gray", "Yellow", "Orange", "Pink"],
    }
    ]
}

export const cat_template: Template = {
    name: "Cat",
    prompt: "Generate a cat.",
    imagePrompt: "Generate an image of a cat",
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
    prompt: "Generate a persona for a dating site.",
    imagePrompt: "Generate a portrait picture of a persona for a dating platform.",
    datafields: [{
        id: "name",
        name: "name",
        type: "string",
        values: [],
    },
    {
        id: "age",
        name: "age",
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
    imagePrompt: "",
    prompt: "",
    datafields: []
}

export interface FieldValues {
    [key: string]: string | null;
    imageBase64: string | null; // Now explicitly required but can be null
}

export const initial_templates: Templates = { templates: [empty_template, ecommerce_template, semanticlove_template, cat_template] }
