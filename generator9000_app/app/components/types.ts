const clothingMaterials = [
    "Cotton",
    "Polyester",
    "Wool",
    "Silk",
    "Linen",
    "Rayon",
    "Nylon",
    "Spandex",
    "Leather",
    "Denim",
    "Velvet",
    "Chiffon",
    "Lace",
    "Satin",
    "Cashmere",
    "Bamboo",
    "Hemp",
    "Modal",
    "Lyocell (Tencel)",
    "Acrylic"
];

const clothingSubCategories = [
    "Tops",
    "T-Shirt",
    "Sweaters",
    "Trousers",
    "Jeans",
    "Shorts",
    "Skirts",
    "Dresses",
    "Formal"
]

const brands = [
    "Denim & Dash",
    "Bay-Ran",
    "Leopard",
    "Oakstock",
    "Mike",
    "Arco-Olo",
    "Lucci",
    "Drada",
    "Southstar",
    "Hunter"
];

const colors = [
    "Red", "Blue", "Green", "White", "Black", "Gray", "Yellow", "Orange", "Pink", "Purple", "Beige"
];

const accessoryMaterials = [
    "Stainless Steel",
    "Titanium",
    "Gold",
    "Silver",
    "Platinum",
    "Aluminum",
    "Carbon Fiber",
    "Rubber",
    "Silicone",
    "Sapphire Crystal",
    "Mineral Glass",
    "Acetate",
    "Polycarbonate",
    "Wood",
    "Ceramic",
    "Polyurethane",
    "Nylon",
    "Brass",
    "Bronze"
];


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

export const cat_template: Template = {
    name: "Cat",
    prompt: "Craft a vivid and detailed description of a unique cat, incorporating elements such as its breed, distinctive physical characteristics, personality traits, and any remarkable story or background. Focus on painting a picture with words that brings the cat to life for the reader, highlighting its interactions with its environment, its preferences, and any quirks that make it stand out. Aim for a narrative that not only informs but also captivates, weaving in factual elements about the breed with creative storytelling to make the description as engaging and memorable as possible.",
    imagePrompt: "Create an image that portrays a cat in a way that transcends the ordinary, capturing its essence in a setting or with attributes that highlight its unique characteristics.This could involve illustrating the cat in an environment that reflects its natural habitat or personality, incorporating elements that showcase its breed's specific traits, or even imagining the cat in a scenario that tells a story. The goal is to generate an image that is not only realistic but also infused with intrigue and depth, making the viewer feel as if they are getting a glimpse into the cat's own world.The image should be detailed and expressive, suitable for educational or artistic purposes, with a focus on realism blended with creative flair.",
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
        id: "short_description",
        name: "short_description",
        type: "string",
        values: [],
    },
    {
        id: "origin",
        name: "origin",
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
        id: "fun_fact",
        name: "fun_fact",
        type: "string",
        values: [],
    },
    {
        id: "race",
        name: "race",
        type: "string[]",
        values: [],
    }
    ]
}

export const dating_template: Template = {
    name: "Dating App",
    prompt: "Generate a persona for a dating site.",
    imagePrompt: "Create a realistic portrait of an AI-generated person suitable for a dating platform mockup. The individual should appear approachable and attractive, with a warm, genuine smile that reflects a friendly and inviting personality. Ensure the lighting is natural and flattering, highlighting their best features. The background should be subtly blurred to keep the focus on the person, resembling a high-quality photograph one might use on a professional dating site. The person's attire should be casual yet put-together, conveying a sense of style and confidence. Aim for an image that embodies authenticity, with a person who looks like they could be someone's next great date. The overall impression should be positive, making the viewer feel drawn to the person's profile.",
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
    },
    {
        id: "description",
        name: "description",
        type: "string",
        values: [],
    }
    ]
}

export const electronics_template: Template = {
    name: "Old Electronics",
    prompt: "Generate a old electronic device for a retail shop. It can be old cameras, keyboards, typewriter, etc.",
    imagePrompt: "Generate an old electronic device image picture for a retail shop.",
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
        id: "electronic_type",
        name: "electronic_type",
        type: "string",
        values: [],
    },
    {
        id: "price",
        name: "price",
        type: "number",
        values: [],
    },
    {
        id: "history",
        name: "history",
        type: "string",
        values: [],
    }
    ]
}

export const empty_template: Template = {
    name: "Empty",
    imagePrompt: "",
    prompt: "",
    datafields: []
}

export const clothing_template: Template = {
    name: "Clothing",
    prompt: "Generate a fashion clothing item product. It can be Tops, T-Shirts, Sweaters, Trousers, Jeans, Shorts, Skirts, Dresses, Formal",
    imagePrompt: "Create a highly detailed and realistic image of a single clothing item, presented as if for an e-commerce website. The item should be either laid flat or hanging against a pure white background, with no additional items, decorations, or visual elements present. The clothing should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view suitable for online shopping.",
    datafields: [{
        id: "title",
        name: "title",
        type: "string",
        values: [],
    },
    {
        id: "brand",
        name: "brand",
        type: "string",
        values: brands
    },
    {
        id: "gender",
        name: "gender",
        type: "string",
        values: ["male", "female", "unisex"],
    },
    {
        id: "sub_category",
        name: "sub_category",
        type: "string",
        values: clothingSubCategories,
    },
    {
        id: "price",
        name: "price",
        type: "number",
        values: [],
    },
    {
        id: "rating",
        name: "rating",
        type: "number",
        values: ["1", "2", "3", "4", "5"],
    },
    {
        id: "category",
        name: "category",
        type: "string",
        values: ["Clothing"],
    },
    {
        id: "description",
        name: "description",
        type: "string",
        values: [],
    },
    {
        id: "material",
        name: "material",
        type: "string",
        values: clothingMaterials,
    },
    {
        id: "age",
        name: "age",
        type: "string",
        values: ["kids", "adults", "seniors"],
    },
    {
        id: "colors",
        name: "colors",
        type: "string[]",
        values: colors,
    }
    ]
}

export interface FieldValues {
    [key: string]: string | null;
    imageBase64: string | null; // Now explicitly required but can be null
}

export const initial_templates: Templates = { templates: [empty_template, dating_template, cat_template, electronics_template, clothing_template] }
