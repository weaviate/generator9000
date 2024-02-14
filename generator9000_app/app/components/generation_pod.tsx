'use client'

import React, { useState, useEffect } from 'react';
import { DataField } from './types'


interface GenerationPodComponentProps {
    prompt: string;
    dataFields: DataField[];
}

const GenerationPodComponent: React.FC<GenerationPodComponentProps> = ({ prompt, dataFields }) => {

    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});

    const handleFieldChange = (id: string, value: string) => {
        setFieldValues(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div>
            <div className='flex items-center justify-center'>
                <button className="btn  btn-outline btn-circle w-full m-2">Generate</button>
            </div>
            <div className='shadow-xl rounded-lg p-4 justify-center items-center'>
                <div className='bg-gray-300 h-full rounded-xl shadow-md p-4'>
                    <div className='flex justify-center items-center mb-4'>
                        <p className='text-light text-sm'>No image generated</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <button className="btn btn-sm btn-outline ">Add Image</button>
                    </div>
                </div>
                <div className='mt-4'>
                    {dataFields.map(field => (
                        <div key={field.id} className="mb-2 flex justify-between items-center gap-2">
                            <div className='flex items-center justify-center w-1/3'>
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
        </div>
    );
};

export default GenerationPodComponent;
