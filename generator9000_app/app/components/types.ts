export interface DataField {
    id: string; // Unique identifier for each data field
    name: string;
    type: string;
    values: string[]; // Assuming values are stored as an array of strings
}

interface Template {
    name: string;
    prompt: string;
    datafields: DataField[]; // Correctly type the datafields property here
}

interface Templates {
    templates: Template[];
}

export const ecommerce_template: Template = {
    name: "E-Commerce",
    prompt: "Generate an E-Commerce Fashion Product in the domain of Fashion, based on this JSON. Please return the same JSON.",
    datafields: [{
        id: "product_name",
        name: "product_name",
        type: "string",
        values: [],
    },
    {
        id: "product_brand",
        name: "product_brand",
        type: "string",
        values: [],
    },
    {
        id: "product_category",
        name: "product_category",
        type: "string[]",
        values: ["shoes", "clothing", "sportswear", "accessoires"],
    },
    {
        id: "product_price",
        name: "product_price",
        type: "number",
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

export const templates: Templates = { templates: [empty_template, ecommerce_template, semanticlove_template] }
