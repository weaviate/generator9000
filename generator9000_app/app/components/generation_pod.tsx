'use client'

import React, { useState, useEffect } from 'react';
import { DataField, GeneratedObject } from './types'
import { ImCheckmark } from "react-icons/im";
import { FaRedoAlt } from "react-icons/fa";
import { generateImageBasedDescription, generateDataBasedPrompt, uploadToAWS } from "./server_actions"

import { v4 as uuidv4 } from 'uuid';


interface GenerationPodComponentProps {
    id: string;
    prompt: string;
    imagePrompt: string;
    dataFields: DataField[];
    includeImageBase64: boolean;
    selectedBucket: string;
    generateData: boolean;
    generateImage: boolean;

    onSaveObject: (generatedObject: GeneratedObject) => void;
    imageSize: string;
    imageStyle: string;
    temperature: number;
    shouldGenerate: boolean;
    onGenerationComplete: () => void;
    shouldSave: boolean;
    APIEnvKeyAvailable: boolean;
    APISetKey: string;
    onSaveComplete: () => void;
    addGenerations: (add_generations: number) => void;
    addCosts: (add_cost: number) => void;
    addTime: (add_time: number) => void;

}

const GenerationPodComponent: React.FC<GenerationPodComponentProps> = ({ generateData, generateImage, APIEnvKeyAvailable, APISetKey, includeImageBase64, selectedBucket, prompt, imagePrompt, shouldGenerate, shouldSave, dataFields, onSaveObject, onSaveComplete, id, imageSize, imageStyle, temperature, addGenerations, addCosts, addTime, onGenerationComplete }) => {

    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageLink, setImageLink] = useState("")

    const [generatingImage, setGeneratingImage] = useState(false);
    const [generatingData, setGeneratingData] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [showEmptyAlert, setShowEmptyAlert] = useState(false);

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

    useEffect(() => {
        let timerId: ReturnType<typeof setTimeout>;
        if (showEmptyAlert) {
            // Set a timer to hide the alert after 3 seconds
            timerId = setTimeout(() => {
                setShowEmptyAlert(false);
            }, 3000);
        }
        // Clean up the timer when the component unmounts or showAlert changes
        return () => clearTimeout(timerId);
    }, [showEmptyAlert]);

    useEffect(() => {
        if (shouldGenerate) {
            // Perform the generation logic here...
            handleGeneration().then(() => {
                // Notify the parent component that generation is complete
                onGenerationComplete();
            });
        }
    }, [shouldGenerate, onGenerationComplete]);

    useEffect(() => {
        if (shouldSave) {
            // Perform the generation logic here...
            handleSave().then(() => {
                // Notify the parent component that generation is complete
                onSaveComplete();
            });
        }
    }, [shouldSave, onSaveComplete]);

    const isPodEmpty = () => {
        // Check if the image is not set
        const isImageEmpty = !imageBase64;

        // Check if all field values are empty
        const areFieldsEmpty = Object.values(fieldValues).every(value => value === '');

        // The pod is considered empty if there's no image and all field values are empty
        return isImageEmpty && areFieldsEmpty;
    };

    const handleFieldChange = (fieldName: string, value: string) => {
        setFieldValues(prev => ({ ...prev, [fieldName]: value }));
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

        if (generatingImage || generatingData || uploading) {
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

    const handleSave = async () => {

        if (generatingImage || generatingData || uploading) {
            return
        } else if (isPodEmpty()) {
            setShowEmptyAlert(true);
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

        const uniqueId = uuidv4();

        if (includeImageBase64) {
            onSaveObject({ ...fieldValuesByName, id: uniqueId, imageBase64 });
        } else {
            onSaveObject({ ...fieldValuesByName, id: uniqueId });
        }

        if (selectedBucket === "AWS Bucket" && imageBase64) {
            setUploading(true)

            const promise_object = await uploadToAWS(imageLink, uniqueId)
            const response: any = await promise_object.promise

            if (response) {
                setUploading(false)
                resetFieldValues();
                setImageBase64(null);
                setShowAlert(true);
            } else {
                setUploading(false)
            }

        } else {

            resetFieldValues();
            setImageBase64(null);
            setShowAlert(true);
            setUploading(false)
        }
    };

    const regenerateImage = async () => {

        const startTime = Date.now();

        if (generatingImage || generatingData || (!APIEnvKeyAvailable && !APISetKey) || !generateImage) {
            return;
        }

        setGeneratingImage(true);

        if (imageSize != "1024x1024" && imageSize != "1792x1024" && imageSize != "1024x1792") {
            return;
        }

        if (imageStyle != "vivid" && imageStyle != "natural") {
            return;
        }

        const image_generation_promise = await generateImageBasedDescription(JSON.stringify(fieldValues), imagePrompt, imageSize, imageStyle, APISetKey);
        const image_generation_results = await image_generation_promise.promise

        if (image_generation_results) {


            if (image_generation_results.error) {
                console.error("Error: " + image_generation_results.error)
            }

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

        if (generatingImage || generatingData || uploading || (!APIEnvKeyAvailable && !APISetKey)) {
            return;
        }

        if (imageSize != "1024x1024" && imageSize != "1792x1024" && imageSize != "1024x1792") {
            return;
        }

        if (imageStyle != "vivid" && imageStyle != "natural") {
            return;
        }

        if (generateData) {
            setGeneratingData(true);
            const promise_object = await generateDataBasedPrompt(prompt, dataFields, temperature, id, APISetKey);
            const results: any = await promise_object.promise;

            if (results) {

                if (results.error) {
                    console.error("Error: " + results.error)
                }

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

                    if (generateImage) {
                        setGeneratingImage(true);
                        const promise_object_image = await generateImageBasedDescription(data, imagePrompt, imageSize, imageStyle, APISetKey);
                        const image_generation_results: any = await promise_object_image.promise;

                        if (image_generation_results) {

                            if (image_generation_results.error) {
                                console.error("Error: " + image_generation_results.error)
                            }

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
                    }

                } else {
                    console.error("Failed to Generate Data");
                    setGeneratingData(false);
                    setGeneratingImage(false);
                }
            }
        } else if (generateImage) {
            setGeneratingImage(true);
            const promise_object_image = await generateImageBasedDescription("", imagePrompt, imageSize, imageStyle, APISetKey);
            const image_generation_results: any = await promise_object_image.promise;

            if (image_generation_results) {

                if (image_generation_results.error) {
                    console.error("Error: " + image_generation_results.error)
                }

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
                                    <a href={imageLink} target="_blank" rel="noopener noreferrer">
                                        <img src={imageBase64} alt="Uploaded" className="max-w-xs max-h-52 rounded-xl" />
                                    </a>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    <button disabled={uploading} onClick={handleDeleteImageModal} className="p-2 bg-red-400 shadow-lg rounded-lg text-sm font-bold mt-2 duration-300 ease-in-out transform hover:scale-105">Delete Image</button>
                                    <button disabled={uploading} onClick={regenerateImage} className="p-3 bg-blue-400 shadow-lg rounded-lg text-sm font-bold mt-2 duration-300 ease-in-out transform hover:scale-105"><FaRedoAlt /></button>
                                </div>
                            </div>
                        )}
                        {!imageBase64 && !generatingImage && (
                            <div className='flex items-center justify-center gap-2'>
                                <div className='flex justify-center items-center mt-1'>
                                    <button onClick={() => document.getElementById(imageInputId)?.click()} className="p-3 shadow-lg rounded-lg bg-zinc-100 text-xs font-semibold duration-300 ease-in-out transform hover:scale-105">Add Image</button>
                                    <input id={imageInputId} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </div>
                                <div className='flex justify-center items-center'>
                                    {
                                        !isPodEmpty() ? (<button disabled={uploading} onClick={regenerateImage} className="p-3 bg-blue-400 shadow-lg rounded-lg text-sm font-bold mt-2 duration-300 ease-in-out transform hover:scale-105"><FaRedoAlt /></button>
                                        ) : (<div></div>)
                                    }
                                </div>
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
                                <input value={fieldValues[field.name] || ''} disabled={generatingData || uploading}
                                    onChange={(e) => handleFieldChange(field.name, e.target.value)} type="text" placeholder="" className="input input-sm input-bordered rounded-xl w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-between items-center gap-2 m-2'>
                <div onClick={handleSave} key={id + "button_save"} className='flex items-center justify-center w-full hover:bg-green-300 bg-green-400 shadow-lg p-4 h-24 rounded-lg duration-300 ease-in-out transform hover:scale-105'>
                    <div className="tooltip" data-tip="Save Object">

                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            {
                                uploading ? (<span className="loading loading-bars loading-sm"></span>) : (<ImCheckmark />)
                            }
                        </button>
                    </div>
                </div>

                <div onClick={handleDeleteObjectModal} key={id + "button_regenerate"} className='flex items-center justify-center w-full bg-blue-400 hover:bg-blue-300 shadow-lg p-4 h-24 rounded-lg duration-300 ease-in-out transform hover:scale-105' >
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

            <div className={`${showEmptyAlert ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} role="alert" >
                <div className="flex gap-2 bg-red-400 shadow-md p-4 mx-4 rounded-lg text-xs items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>I refuse to save empty objects!</span>
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
