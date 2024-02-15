'use client'

import React, { useState, useEffect } from 'react';
import { DataField, FieldValues } from './types'
import { ImCross } from "react-icons/im";
import { ImCheckmark } from "react-icons/im";
import { FaRedoAlt } from "react-icons/fa";


interface GenerationPodComponentProps {
    prompt: string;
    dataFields: DataField[];
    onSaveFieldValues: (fieldValues: FieldValues) => void;
}
const GenerationPodComponent: React.FC<GenerationPodComponentProps> = ({ prompt, dataFields, onSaveFieldValues }) => {

    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});
    const [imageBase64, setImageBase64] = useState<string | null>(null);

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


    return (
        <div>
            <div className='shadow-xl rounded-lg p-4 justify-center items-center'>
                <div className='bg-transparent h-full rounded-xl p-4'>
                    <div className='flex justify-center items-center'>
                        {imageBase64 ? (
                            <div>
                                <div className="flex justify-center items-center mt-4">
                                    <img src={imageBase64} alt="Uploaded" className="max-w-xs max-h-40" />
                                </div>
                                <button onClick={() => setImageBase64(null)} className="btn btn-error btn-sm mt-2">Delete Image</button>
                            </div>
                        ) : (
                            <div>
                                <button onClick={() => document.getElementById('imageInput')?.click()} className="p-4 shadow-lg rounded-lg bg-zinc-100 text-xs font-semibold duration-300 ease-in-out transform hover:scale-105">Add Image</button>
                                <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
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
                            <div>
                                <input value={fieldValues[field.id] || ''}
                                    onChange={(e) => handleFieldChange(field.id, e.target.value)} type="text" placeholder="" className="input input-sm input-bordered rounded-xl w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex justify-between items-center gap-2 m-2'>
                <div onClick={() => { onSaveFieldValues({ ...fieldValues, imageBase64 }); resetFieldValues(); setImageBase64(null); }} className='flex items-center justify-center w-full hover:bg-green-300 bg-green-400 shadow-lg p-4 h-24 rounded-lg duration-300 ease-in-out transform hover:scale-105'>
                    <div className="tooltip" data-tip="Save Object">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <ImCheckmark />
                        </button>
                    </div>
                </div>

                <div onClick={() => { resetFieldValues() }} className='flex items-center justify-center w-full bg-red-400 hover:bg-red-300 shadow-lg p-4 h-24 rounded-lg duration-300 ease-in-out transform hover:scale-105' >
                    <div className="tooltip" data-tip="Clear Object">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <ImCross />
                        </button>
                    </div>
                </div>

                <div onClick={() => { resetFieldValues() }} className='flex items-center justify-center w-full bg-blue-400 hover:bg-blue-300 shadow-lg p-4 h-24 rounded-lg duration-300 ease-in-out transform hover:scale-105' >
                    <div className="tooltip" data-tip="Generate Object">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <FaRedoAlt />
                        </button>
                    </div>
                </div>


            </div>
            <div role="alert" className="flex gap-2 bg-green-400 shadow-md p-4 mx-4 rounded-lg text-xs items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Saved Object!</span>
            </div>
        </div>
    );
};

export default GenerationPodComponent;
