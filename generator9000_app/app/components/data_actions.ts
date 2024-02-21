'use client'

import { DataField, Template, GeneratedObject, importAllPayload } from './types'

export const exportAllToJson = (prompt: string, imagePrompt: string, cost: number, generations: number, timeSpent: number, dataFields: DataField[], generatedObjects: GeneratedObject[]) => {
    const dataToSave = {
        prompt,
        imagePrompt,
        cost,
        generations,
        timeSpent,
        dataFields,
        generatedObjects
    };

    // Create a Blob from the data
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = url;
    downloadAnchorNode.download = "exported_all_data.json"; // Default file name; user can change it if their browser is set to ask
    document.body.appendChild(downloadAnchorNode); // Firefox requires the element to be in the DOM to trigger download
    downloadAnchorNode.click();
    downloadAnchorNode.remove(); // Clean up

    // Release the blob URL to free up resources
    URL.revokeObjectURL(url);
}

export const exportJson = (generatedObjects: GeneratedObject[]) => {
    const dataToSave = generatedObjects;

    // Create a Blob from the data
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = url;
    downloadAnchorNode.download = "exported_data.json"; // Default file name; user can change it if their browser is set to ask
    document.body.appendChild(downloadAnchorNode); // Firefox requires the element to be in the DOM to trigger download
    downloadAnchorNode.click();
    downloadAnchorNode.remove(); // Clean up

    // Release the blob URL to free up resources
    URL.revokeObjectURL(url);
}

export const importAllFromJson = async (event: React.ChangeEvent<HTMLInputElement>): Promise<importAllPayload> => {
    return new Promise((resolve, reject) => {
        if (event.target.files && event.target.files[0]) {
            const fileReader = new FileReader();
            fileReader.readAsText(event.target.files[0], "UTF-8");
            fileReader.onload = e => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    const importedData = JSON.parse(result);

                    const newTemplate: Template = {
                        name: "Current File",
                        imagePrompt: importedData.imagePrompt,
                        prompt: importedData.prompt,
                        datafields: importedData.dataFields
                    };

                    resolve({
                        prompt: importedData.prompt,
                        imagePrompt: importedData.imagePrompt,
                        datafields: importedData.dataFields,
                        generatedObjects: importedData.generatedObjects,
                        cost: importedData.cost,
                        generations: importedData.generations,
                        timeSpent: importedData.timeSpent,
                        template: newTemplate
                    });
                }
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        } else {
            reject(new Error("No files selected."));
        }
    });
};