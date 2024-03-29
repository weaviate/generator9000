const categories = [
    "Clothing",
    "Shoes",
    "Accessories",
    "Outerwear",
]

const clothingSubCategories = [
    "Tops",
    "T-Shirts",
    "Sweaters",
    "Trousers",
    "Jeans",
    "Shorts",
    "Skirts",
    "Dresses",
    "Formal"
]

const shoesSubCategories = [
    "Sneakers",
    "Boots",
    "Sandals",
    "Heels",
    "Dress Shoes"
]

const accessoriesSubCategories = [
    "Jewelry",
    "Watches",
    "Hats",
    "Belts",
    "Glasses",
]

const outerwearSubCategories = [
    "Jackets",
    "Coats",
    "Blazers"
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

const clothingMaterials = [
    "Cotton",
    "Polyester",
    "Wool",
    "Silk",
    "Linen",
    "Nylon",
    "Spandex",
    "Leather",
    "Denim",
    "Velvet",
    "Lace",
    "Satin",
    "Cashmere",
    "Hemp",
];

const accessoryMaterials = [
    "Stainless Steel",
    "Titanium",
    "Adamantium",
    "Gold",
    "Silver",
    "Platinum",
    "Aluminum",
    "Carbon Fiber",
    "Rubber",
    "Silicone",
    "Mineral Glass",
    "Polycarbonate",
    "Wood",
    "Ceramic",
    "Polyurethane",
    "Nylon",
    "Brass",
    "Bronze"
];

const colors = [
    "Red",
    "Blue",
    "Green",
    "White",
    "Black",
    "Gray",
    "Yellow",
    "Orange",
    "Pink",
    "Purple",
    "Beige",
    "Teal",
    "Brown",
    "Petrol",
    "Olive",
    "Lilac",
    "Gold",
    "Silver",
    "Orange",
    "Turquoise"
];

export type FlexibleDictionary = {
    [key: string]: any;
};

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
    imageField?: string;
    datafields: DataField[]; // Correctly type the datafields property here
}

export const cat_template: Template = {
    name: "Cat",
    imageField: "img",
    prompt: "Craft a vivid and detailed description of a unique cat, incorporating elements such as its breed, distinctive physical characteristics, personality traits, and any remarkable story or background. Focus on painting a picture with words that brings the cat to life for the reader, highlighting its interactions with its environment, its preferences, and any quirks that make it stand out. Aim for a narrative that not only informs but also captivates, weaving in factual elements about the breed with creative storytelling to make the description as engaging and memorable as possible.",
    imagePrompt: "Create an image that portrays a cat in a way that transcends the ordinary, capturing its essence in a setting or with attributes that highlight its unique characteristics.This could involve illustrating the cat in an environment that reflects its natural habitat or personality, incorporating elements that showcase its breed's specific traits, or even imagining the cat in a scenario that tells a story. The goal is to generate an image that is not only realistic but also infused with intrigue and depth, making the viewer feel as if they are getting a glimpse into the cat's own world.The image should be detailed and expressive, suitable for educational or artistic purposes, with a focus on realism blended with creative flair.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "color",
        name: "color",
        type: "text",
        values: [],
    },
    {
        id: "short_description",
        name: "short_description",
        type: "text",
        values: [],
    },
    {
        id: "origin",
        name: "origin",
        type: "text",
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
        type: "text",
        values: [],
    },
    {
        id: "race",
        name: "race",
        type: "text[]",
        values: [],
    }
    ]
}

export const electronics_template: Template = {
    name: "Old Electronics",
    prompt: "Generate a old electronic device for a retail shop. It can be old cameras, keyboards, typewriter, etc.",
    imageField: "img",
    imagePrompt: "Generate an old electronic device image picture for a retail shop.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "age",
        name: "age",
        type: "number",
        values: [],
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "electronic_type",
        name: "electronic_type",
        type: "text",
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
        type: "text",
        values: [],
    }
    ]
}

export const fastfood_template: Template = {
    name: "Fast Food",
    prompt: "Generate a fastfood item for a restaurant menu.",
    imageField: "img",
    imagePrompt: "Create a highly detailed and realistic image of a single food item, presented as if for an menu. The item should be placed on a white plate against a pure white background, with no additional items, decorations, or visual elements present. The food item should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "price",
        name: "price",
        type: "number",
        values: [],
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "ingredients",
        name: "ingredients",
        type: "text[]",
        values: [],
    },
    {
        id: "calories",
        name: "calories",
        type: "number",
        values: [],
    },
    {
        id: "description",
        name: "description",
        type: "text",
        values: [],
    }
    ]
}

export const foodingredients_template: Template = {
    name: "Food Ingredients",
    imageField: "img",
    prompt: "Generate a food ingredient item for an ecommerce site.",
    imagePrompt: "Create a highly detailed and realistic image of a single food item, presented as if for an e-commerce site. The item should be placed on a white plate against a pure white background, with no additional items, decorations, or visual elements present. The item should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "price",
        name: "price",
        type: "number",
        values: [],
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "nutrients",
        name: "nutrients",
        type: "text[]",
        values: [],
    },
    {
        id: "origin",
        name: "origin",
        type: "text",
        values: [],
    },
    {
        id: "food_type",
        name: "food_type",
        type: "text[]",
        values: [],
    },
    {
        id: "calories",
        name: "calories",
        type: "number",
        values: [],
    },
    {
        id: "description",
        name: "description",
        type: "text",
        values: [],
    }
    ]
}

export const empty_template: Template = {
    name: "Blank",
    imagePrompt: "",
    prompt: "",
    datafields: []
}

export const clothing_template: Template = {
    name: "Clothing",
    imageField: "img",
    prompt: "Generate a fashion clothing item product in these categories: T-Shirts, Sweaters, Trousers, Jeans, Shorts, Skirts, Dresses, Formal. Only use 1 or 2 colors, write short and precise descriptions. Be creative with the naming and the descriptions. Don't use words like Lunar, Midnight, Twilight, Ocean, Seaside or similar. ",
    imagePrompt: "Create a highly detailed and realistic image of a single clothing item with only one color combination, presented as if for an e-commerce website. The item should be either laid flat or hanging against a pure white background, with no additional items, decorations, or visual elements present. The clothing should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view suitable for online shopping.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "brand",
        name: "brand",
        type: "text",
        values: brands
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "category",
        name: "category",
        type: "text",
        values: ["Clothing"],
    },
    {
        id: "sub_category",
        name: "sub_category",
        type: "text",
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
        id: "description",
        name: "description",
        type: "text",
        values: [],
    },
    {
        id: "material",
        name: "material",
        type: "text[]",
        values: clothingMaterials,
    },
    {
        id: "colors",
        name: "colors",
        type: "text[]",
        values: colors,
    }
    ]
}

export const shoes_template: Template = {
    name: "Shoes",
    imageField: "img",
    prompt: "Generate a fashion shoe item product in these categories:" + shoesSubCategories + " . Only use 1 or 2 colors, write short and precise descriptions. Be creative with the naming and the descriptions. Don't use words like Lunar, Midnight, Twilight, Ocean, Seaside or similar. ",
    imagePrompt: "Create a highly detailed and realistic image of a single shoe item, presented as if for an e-commerce website. The item should be either laid flat or hanging against a pure white background, with no additional items, decorations, or visual elements present. The shoe should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view suitable for online shopping.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "brand",
        name: "brand",
        type: "text",
        values: brands
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "category",
        name: "category",
        type: "text",
        values: ["Shoes"],
    },
    {
        id: "sub_category",
        name: "sub_category",
        type: "text",
        values: shoesSubCategories,
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
        id: "description",
        name: "description",
        type: "text",
        values: [],
    },
    {
        id: "material",
        name: "material",
        type: "text[]",
        values: clothingMaterials,
    },
    {
        id: "colors",
        name: "colors",
        type: "text[]",
        values: colors,
    }
    ]
}

export const accessoires_template: Template = {
    name: "Accessories",
    imageField: "img",
    prompt: "Generate a Accessories item product in these categories:" + accessoriesSubCategories + " . Only use 1 or 2 colors, write short and precise descriptions. Be creative with the naming and the descriptions. Don't use words like Lunar, Midnight, Twilight, Ocean, Seaside or similar. ",
    imagePrompt: "Create a highly detailed and realistic image of a single accessories item with only one color combination, presented as if for an e-commerce website. The item should be either laid flat or hanging against a pure white background, with no additional items, decorations, or visual elements present. The item should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view suitable for online shopping.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "brand",
        name: "brand",
        type: "text",
        values: brands
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "category",
        name: "category",
        type: "text",
        values: ["Accessories"],
    },
    {
        id: "sub_category",
        name: "sub_category",
        type: "text",
        values: accessoriesSubCategories,
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
        id: "description",
        name: "description",
        type: "text",
        values: [],
    },
    {
        id: "material",
        name: "material",
        type: "text[]",
        values: accessoryMaterials,
    },
    {
        id: "colors",
        name: "colors",
        type: "text[]",
        values: colors,
    }
    ]
}

export const outerwear_template: Template = {
    name: "Outerwear",
    imageField: "img",
    prompt: "Generate a Outerwear item product in these categories:" + outerwearSubCategories + " . Only use 1 or 2 colors, write short and precise descriptions. Be creative with the naming and the descriptions. Don't use words like Lunar, Midnight, Twilight, Ocean, Seaside or similar. ",
    imagePrompt: "Create a highly detailed and realistic image of a single Outerwear item with only one color combination, presented as if for an e-commerce website. The item should be either laid flat or hanging against a pure white background, with no additional items, decorations, or visual elements present. The clothing should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view suitable for online shopping.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "brand",
        name: "brand",
        type: "text",
        values: brands
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "category",
        name: "category",
        type: "text",
        values: ["Outerwear"],
    },
    {
        id: "sub_category",
        name: "sub_category",
        type: "text",
        values: outerwearSubCategories,
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
        id: "description",
        name: "description",
        type: "text",
        values: [],
    },
    {
        id: "material",
        name: "material",
        type: "text[]",
        values: clothingMaterials,
    },
    {
        id: "colors",
        name: "colors",
        type: "text[]",
        values: colors,
    }
    ]
}


export const kitchenware_template: Template = {
    name: "Kitchenware",
    imageField: "img",
    prompt: "Generate a kitchenware product likes plates and dishes. Be creative with the naming and the descriptions.",
    imagePrompt: "Create a highly detailed and realistic image of a single kitchenware item with one to two color combination, presented as if for an e-commerce website. The item should be either laid flat or hanging against a pure white background, with no additional items, decorations, or visual elements present. The clothing should be fully visible, capturing its texture and colors accurately, offering a clear and straightforward view suitable for online shopping.",
    datafields: [{
        id: "name",
        name: "name",
        type: "text",
        values: [],
    },
    {
        id: "brand",
        name: "brand",
        type: "text",
        values: []
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "category",
        name: "category",
        type: "text",
        values: [],
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
        id: "description",
        name: "description",
        type: "text",
        values: [],
    },
    {
        id: "material",
        name: "material",
        type: "text[]",
        values: [],
    },
    {
        id: "colors",
        name: "colors",
        type: "text[]",
        values: colors,
    }
    ]
}

export const book_template: Template = {
    name: "Books",
    prompt: "Generate a book",
    imageField: "img",
    imagePrompt: "Create a highly detailed and realistic image of a book with a blurred background, candles and in a library.",
    datafields: [{
        id: "title",
        name: "title",
        type: "text",
        values: [],
    },
    {
        id: "author",
        name: "author",
        type: "text",
        values: []
    },
    {
        id: "img",
        name: "img",
        type: "text",
        values: []
    },
    {
        id: "pages",
        name: "pages",
        type: "number",
        values: [],
    },
    {
        id: "abstract",
        name: "abstract",
        type: "text",
        values: [],
    },
    {
        id: "publisher",
        name: "publisher",
        type: "text",
        values: [],
    },
    {
        id: "genre",
        name: "genre",
        type: "text",
        values: [],
    }
    ]
}


export interface GeneratedObject {
    [key: string]: string | null;
}

export const initial_templates: Template[] = [empty_template, foodingredients_template, book_template, kitchenware_template, outerwear_template, accessoires_template, fastfood_template, shoes_template, cat_template, electronics_template, clothing_template]

export interface importAllPayload {
    prompt: string,
    imagePrompt: string,
    datafields: DataField[],
    generatedObjects: GeneratedObject[],
    cost: number,
    generations: number,
    timeSpent: number,
    template: Template
}