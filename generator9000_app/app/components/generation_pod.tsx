'use client'

import React, { useState, useEffect } from 'react';
import { DataField, FieldValues } from './types'
import { ImCheckmark } from "react-icons/im";
import { FaRedoAlt } from "react-icons/fa";
import { generateImageBasedDescription, generateDataBasedPrompt } from "./server_actions"

interface GenerationPodComponentProps {
    id: string;
    prompt: string;
    imagePrompt: string;
    dataFields: DataField[];
    onSaveFieldValues: (fieldValues: FieldValues) => void;
    imageSize: string;
    imageStyle: string;
    temperature: number;
    addGenerations: (add_generations: number) => void;
    addCosts: (add_cost: number) => void;
    addTime: (add_time: number) => void;
}
const GenerationPodComponent: React.FC<GenerationPodComponentProps> = ({ prompt, imagePrompt, dataFields, onSaveFieldValues, id, imageSize, imageStyle, temperature, addGenerations, addCosts, addTime }) => {

    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageLink, setImageLink] = useState("")

    const [generatingImage, setGeneratingImage] = useState(false);
    const [generatingData, setGeneratingData] = useState(false);

    const [showAlert, setShowAlert] = useState(false);

    const imageInputId = `imageInput-${id}`;
    const deleteImageModalId = `delete_image_modal-${id}`;
    const deleteObjectModalId = `delete_object_modal-${id}`;

    useEffect(() => {
        let timerId: ReturnType<typeof setTimeout>;
        if (showAlert) {
            // Set a timer to hide the alert after 3 seconds
            timerId = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
        // Clean up the timer when the component unmounts or showAlert changes
        return () => clearTimeout(timerId);
    }, [showAlert]);

    const isPodEmpty = () => {
        // Check if the image is not set
        const isImageEmpty = !imageBase64;

        // Check if all field values are empty
        const areFieldsEmpty = Object.values(fieldValues).every(value => value === '');

        // The pod is considered empty if there's no image and all field values are empty
        return isImageEmpty && areFieldsEmpty;
    };

    const handleFieldChange = (id: string, value: string) => {
        setFieldValues(prev => ({ ...prev, [id]: value }));
    };

    const resetFieldValues = () => {
        setFieldValues({});
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setImageBase64(e.target?.result as string);
            };

            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleDeleteImageModal = () => {

        if (generatingImage) {
            return
        }

        const modal = document.getElementById(deleteImageModalId);
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.error('Modal element not found');
        }
    }

    const handleDeleteObjectModal = () => {

        if (generatingImage) {
            return
        }

        if (isPodEmpty()) {
            handleGeneration();

        } else {
            const modal = document.getElementById(deleteObjectModalId);
            if (modal instanceof HTMLDialogElement) {
                modal.showModal();
            } else {
                console.error('Modal element not found');
            }
        }

    }

    const handleSave = () => {

        if (generatingImage) {
            return
        }

        const fieldValuesByName = Object.keys(fieldValues).reduce((acc: { [key: string]: string }, currentId) => {
            // Find the field in dataFields by id
            const field = dataFields.find(field => field.id === currentId);
            if (field) {
                // TypeScript now understands that acc can be indexed with a string.
                acc[field.name] = fieldValues[currentId];
            }
            return acc;
        }, {} as { [key: string]: string }); // Cast the initial value of reduce to the correct type

        // Proceed with your saving logic
        onSaveFieldValues({ ...fieldValuesByName, imageBase64 });
        resetFieldValues();
        setImageBase64(null);
        setShowAlert(true);
    };

    const regenerateImage = async () => {

        const startTime = Date.now();

        if (generatingImage || generatingData) {
            return;
        }

        setGeneratingImage(true);

        const fieldsDescription = dataFields.map(field => {
            let fieldDesc = `${field.name} (${field.type})`;
            if (field.values && field.values.length > 0) {
                fieldDesc += ` with possible values: ${field.values.join(', ')}`;
            }
            return fieldDesc;
        }).join('; ');

        if (imageSize != "1024x1024" && imageSize != "1792x1024" && imageSize != "1024x1792") {
            return;
        }

        if (imageStyle != "vivid" && imageStyle != "natural") {
            return;
        }


        const image_generation_results = await generateImageBasedDescription(fieldsDescription, imagePrompt, imageSize, imageStyle);

        if (image_generation_results) {
            const generated_image = image_generation_results.image;
            const url = image_generation_results.url;

            addGenerations(1)

            if (imageSize === "1024x1024") {
                addCosts(0.080)
            } else {
                addCosts(0.120)
            }

            const endTime = Date.now(); // End timing
            const timeSpent = (endTime - startTime) / 60000;
            addTime(timeSpent)

            setImageBase64(generated_image)
            setImageLink(url)
            setGeneratingImage(false);

        } else {
            setGeneratingImage(false);
        }

    }

    const handleGeneration = async () => {

        const startTime = Date.now();

        if (generatingImage || generatingData) {
            return;
        }

        setGeneratingImage(true);
        setGeneratingData(true);

        if (imageSize != "1024x1024" && imageSize != "1792x1024" && imageSize != "1024x1792") {
            return;
        }

        if (imageStyle != "vivid" && imageStyle != "natural") {
            return;
        }

        const results = await generateDataBasedPrompt(prompt, dataFields, temperature);

        const data = results.results
        const data_cost = results.costs

        if (data) {
            // Assuming data is a JSON string; if it's already an object, remove JSON.parse
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

            // Update the fieldValues state with the generated data
            setFieldValues(parsedData);
            addGenerations(1)
            setGeneratingData(false);
            addCosts(data_cost)

            const image_generation_results = await generateImageBasedDescription(data, imagePrompt, imageSize, imageStyle);

            if (image_generation_results) {
                const generated_image = image_generation_results.image;
                const url = image_generation_results.url;

                setImageBase64(generated_image)
                setImageLink(url)
                addGenerations(1)
                if (imageSize === "1024x1024") {
                    addCosts(0.080)
                } else {
                    addCosts(0.120)
                }
                setGeneratingImage(false);
                const endTime = Date.now(); // End timing
                const timeSpent = (endTime - startTime) / 60000;
                addTime(timeSpent)

            } else {
                setGeneratingImage(false);
            }


        } else {
            console.error("Failed to Generate Data");
            setGeneratingData(false);
            setGeneratingImage(false);
        }
    };

    return (
        <div className=''>
            <div className='shadow-xl rounded-lg p-4 justify-center items-center'>
                <div className='bg-transparent h-full rounded-xl p-4'>
                    <div className='flex justify-center items-center'>
                        {generatingImage && (
                            <div className='flex items-center justify-center m-2'>
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        )}
                        {imageBase64 && !generatingImage && (
                            <div>
                                <div className="flex justify-center items-center mt-4">
                                    <a href={imageLink}>
                                        <img src={imageBase64} alt="Uploaded" className="max-w-xs max-h-52 rounded-xl" />
                                    </a>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    <button onClick={handleDeleteImageModal} className="p-2 bg-red-400 shadow-lg rounded-lg text-sm font-bold mt-2 duration-300 ease-in-out transform hover:scale-105">Delete Image</button>
                                    <button onClick={regenerateImage} className="p-3 bg-blue-400 shadow-lg rounded-lg text-sm font-bold mt-2 duration-300 ease-in-out transform hover:scale-105"><FaRedoAlt /></button>

                                </div>
                            </div>
                        )}
                        {!imageBase64 && !generatingImage && (
                            <div>
                                <button onClick={() => document.getElementById(imageInputId)?.click()} className="p-4 shadow-lg rounded-lg bg-zinc-100 text-xs font-semibold duration-300 ease-in-out transform hover:scale-105">Add Image</button>
                                <input id={imageInputId} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </div>

                        )}
                    </div>
                </div>
                <div className='mt-4'>
                    {dataFields.map(field => (
                        <div key={field.id} className="mb-2 flex justify-between items-center gap-2">
                            <div className='flex items-center justify-start w-1/3'>
                                <label className="text-sm font-light">{field.name}</label>
                            </div>
                            <div className='flex gap-2'>
                                {generatingData && (
                                    <span className="loading loading-dots loading-sm"></span>
                                )}
                                <input value={fieldValues[field.id] || ''} disabled={generatingData}
                                    onChange={(e) => handleFieldChange(field.id, e.target.value)} type="text" placeholder="" className="input input-sm input-bordered rounded-xl w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-between items-center gap-2 m-2'>
                <div onClick={handleSave} className='flex items-center justify-center w-full hover:bg-green-300 bg-green-400 shadow-lg p-4 h-24 rounded-lg duration-300 ease-in-out transform hover:scale-105'>
                    <div className="tooltip" data-tip="Save Object">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <ImCheckmark />
                        </button>
                    </div>
                </div>

                <div onClick={handleDeleteObjectModal} className='flex items-center justify-center w-full bg-blue-400 hover:bg-blue-300 shadow-lg p-4 h-24 rounded-lg duration-300 ease-in-out transform hover:scale-105' >
                    <div className="tooltip" data-tip="Generate Object">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <FaRedoAlt />
                        </button>
                    </div>
                </div>


            </div>
            <div className={`${showAlert ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} role="alert" >
                <div className="flex gap-2 bg-green-400 shadow-md p-4 mx-4 rounded-lg text-xs items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Saved Object!</span>
                </div>
            </div>

            <dialog id={deleteImageModalId} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete Image?</h3>
                    <p className="py-4">Do you want to remove the image from the object?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-error" onClick={() => setImageBase64(null)} >Delete</button>
                            <button className="btn ml-2">No</button>
                        </form>
                    </div>
                </div>
            </dialog>

            <dialog id={deleteObjectModalId} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Generate new object?</h3>
                    <p className="py-4">Remove current object and generate new?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn bg-blue-400 hover:bg-blue-300" onClick={() => { resetFieldValues(); setImageBase64(null); handleGeneration(); }} >Re-Generate</button>
                            <button className="btn ml-2">No</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </div>
    );
};

export default GenerationPodComponent;
