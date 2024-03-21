'use client'


import React, { useEffect, useState } from 'react';
import DataFieldComponent from './datafield'
import { Template, DataField } from './types'

import { MdOutgoingMail } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { MdCollectionsBookmark } from "react-icons/md";

import { v4 as uuidv4 } from 'uuid';

import { useRouter, useSearchParams } from 'next/navigation'

interface PromptMenuComponentProps {
    prompt: string;
    imagePrompt: string;
    selectedTemplate: string;
    templates: Template[];
    dataFields: DataField[];
    weaviateStatus: "not connected" | "connecting" | "connected";
    weaviateCollectionName: string;
    selectedImageField: string;
    setSelectedImageField: (_name: string) => void;
    setWeaviateCollectionName: (_name: string) => void;
    setPrompt: (_prompt: string) => void;
    setImagePrompt: (_prompt: string) => void;
    setSelectedTemplate: (_template: string) => void;
    setDataFields: (_datafields: DataField[]) => void;
    setGenerateOptions: (data: boolean, image: boolean) => void;
}

const PromptMenuComponent: React.FC<PromptMenuComponentProps> = ({ prompt, selectedImageField, imagePrompt, selectedTemplate, templates, dataFields, weaviateStatus, weaviateCollectionName, setPrompt, setImagePrompt, setDataFields, setSelectedTemplate, setGenerateOptions, setWeaviateCollectionName, setSelectedImageField }) => {

    const router = useRouter();
    const searchParams = useSearchParams()

    const [generateData, setGenerateData] = useState(true)
    const [generateImage, setGenerateImage] = useState(true)

    useEffect(() => {

        const _template = searchParams.get('template')

        if (_template) {
            setSelectedTemplate(_template)
            const template = templates.find(t => t.name === _template);
            if (template) {
                setPrompt(template.prompt);
                setDataFields(template.datafields);
                setImagePrompt(template.imagePrompt)
            }
        }
        else {
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.set('template', "Empty");
            router.push(`/?${newSearchParams}`, { scroll: false });
        }

    }, [searchParams]);


    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        setSelectedTemplate(name); // Update the selected template state
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('template', name);
        router.push(`/?${newSearchParams}`, { scroll: false });
        const template = templates.find(t => t.name === name);

        if (template) {
            if (template.name != "New Collection" && weaviateStatus === "connected") {
                setWeaviateCollectionName(template.name)
            } else {
                setWeaviateCollectionName("")
            }

            setPrompt(template.prompt);
            setDataFields(template.datafields);
            setImagePrompt(template.imagePrompt)

            if (template.imageField) {
                setSelectedImageField(template.imageField)
            }

        }
    };

    const handleImageFieldChange = (_template: string, _field: string) => {
        const template = templates.find(t => t.name === _template);

        if (template) {
            template.imageField = _field
        }
    }

    const addDataField = () => {
        const newDataField: DataField = {
            id: uuidv4(), // Generate a unique ID for each new data field
            name: "",
            type: "string",
            values: [],
        };
        setDataFields([...dataFields, newDataField]);
    };

    const deleteDataField = (id: string) => {
        setDataFields(dataFields.filter(field => field.id !== id));
    };

    const updateDataField = (id: string, updatedField: Partial<DataField>) => {
        setDataFields(dataFields.map(field => field.id === id ? { ...field, ...updatedField } : field));
    };

    const openDebugModal = () => {
        const modal = document.getElementById('debug_modal');

        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.error('Debug modal not found');
        }
    }

    return (
        <div>
            <div className='p-2'>
                <div className='flex justify-between items-center mb-4'>
                    <button className="btn btn-xs border-none shadow-none bg-transparent text-opacity-25 hover:text-opacity-100 hover:bg-transparent" onClick={openDebugModal}><MdOutgoingMail size={20} /></button>
                    <p className=''>Prompt</p>
                    <select value={selectedTemplate}
                        onChange={handleTemplateChange}
                        className="select select-sm select-bordered w-full max-w-xs">
                        {templates.map((template) => (
                            <option key={template.name} value={template.name}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>

                {weaviateStatus === "connected" && (
                    <div>
                        <p className='text-xs font-light mb-1'>Saving objects to</p>
                        <label className="input input-bordered flex items-center gap-2 mt-2 mb-6">
                            <div className="flex gap-2 items-center">
                                <MdCollectionsBookmark />
                                <p className='text-xs'>Weaviate Collection:</p>
                            </div>
                            <input disabled={selectedTemplate === weaviateCollectionName} type="text" className="grow text-xs font-bold" value={weaviateCollectionName} onChange={(e) => { setWeaviateCollectionName(e.target.value) }} />
                        </label>
                    </div>
                )}

                <p className='text-xs font-light mb-1'>Data Prompt</p>
                <label className="label cursor-pointer">
                    <p className="label-text text-xs opacity-50">Enable Data Generation</p>
                    <input type="checkbox" checked={generateData} onChange={(e) => { setGenerateData(e.target.checked); setGenerateOptions(e.target.checked, generateImage) }} className="checkbox checkbox-sm" />
                </label>
                <textarea disabled={!generateData} className="textarea textarea-bordered w-full" placeholder="Enter your prompt here" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
                <p className='text-xs font-light mb-1 mt-4'>Image Prompt</p>
                <label className="label cursor-pointer">
                    <p className="label-text text-xs opacity-50">Enable Image Generation</p>
                    <input type="checkbox" checked={generateImage} onChange={(e) => { setGenerateImage(e.target.checked); setGenerateOptions(generateData, e.target.checked) }} className="checkbox checkbox-sm" />
                </label>
                <textarea disabled={!generateImage} className="textarea textarea-bordered w-full" placeholder="Enter your image prompt here" value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)}></textarea>

            </div>
            <div className='p-2'>
                <p className=''>Data Fields</p>

                <div className='flex justify-center items-center mt-2'>
                    <p className='text-sm w-1/3'>Select Image Field</p>
                    <select
                        value={selectedImageField}
                        disabled={dataFields.length == 0}
                        onChange={(e) => { setSelectedImageField(e.target.value); handleImageFieldChange(selectedTemplate, e.target.value) }}
                        className="select select-sm select-bordered w-2/3">
                        {
                            dataFields.filter(field => field.name.trim() !== "").map((field, index) => (
                                <option key={index} value={field.name}>
                                    {field.name}
                                </option>
                            ))
                        }
                    </select>
                </div>


                {dataFields.length <= 0 && (
                    <div className='my-2 text-xs font-light flex justify-start items-center opacity-50'>
                        <p>No data fields</p>
                    </div>
                )}

                {dataFields.map((field, index) => (
                    <DataFieldComponent
                        key={field.id}
                        dataField={field}
                        imageField={selectedImageField === field.name && field.name.length > 0}
                        deleteDataField={() => deleteDataField(field.id)}
                        updateDataField={(updatedField) => updateDataField(field.id, updatedField)}
                        _disabled={selectedTemplate === weaviateCollectionName && weaviateStatus === "connected"}
                    />
                ))}

                {selectedTemplate != weaviateCollectionName && weaviateStatus === "connected" && (
                    <div className='flex justify-center items-center mt-3'>
                        <button className='p-4 flex justify-center items-center gap-2 rounded-lg shadow-lg bg-green-400 text-xs duration-300 ease-in-out transform hover:scale-105' onClick={addDataField}>
                            <IoMdAddCircle />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PromptMenuComponent;
