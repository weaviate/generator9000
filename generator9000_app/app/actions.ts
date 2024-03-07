'use server'


export async function get_API_Status() {
    return !!process.env.OPENAI_API_KEY;
}