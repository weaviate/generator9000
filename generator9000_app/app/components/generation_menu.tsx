'use client'

import React, { useState } from 'react';

import SettingsModalComponent from './settings_modal';
import { DataField, GeneratedObject, FlexibleDictionary } from './types'

import { BiObjectsVerticalBottom } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";

import { FaRedoAlt } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";

import GenerationPodComponent from './generation_pod'
import InspectModeComponent from './inspect';
import InspectWeaviateComponent from './inspect_weaviate';

import ExportModalComponent from './export_modal';

interface GenerationMenuComponentProps {

    generations: number
    cost: number;
    timeSpent: number;
    mode: string;
    imagePrompt: string;
    prompt: string;
    dataFields: DataField[];
    generatedObjects: GeneratedObject[];
    APIEnvKeyAvailable: boolean;
    generateData: boolean;
    generateImage: boolean;
    selectedImageField: string;
    weaviateData: FlexibleDictionary[];
    weaviateCollectionName: string;
    handleConnectWeaviate: (_url: string, _key: string, collectionName?: string) => void;
    selectedTemplate: string;

    fetchingWeaviateData: boolean;
    weaviateDataCount: number;
    weaviatePage: number;
    setWeaviatePage: (_n: number) => void;
    weaviateStatus: string;

    retrieveWeaviateData: () => void;
    setGenerations: (_n: number) => void;
    setCost: (_n: number) => void;
    setTimeSpent: (_n: number) => void;
    saveGeneratedObjects: (generatedObjects: GeneratedObject) => void;
    handleDelete: (index: number) => void;
    addGenerations: (_n: number) => void;
    addCosts: (_n: number) => void;
    addTimeSpent: (_n: number) => void;
}

const GenerationMenuComponent: React.FC<GenerationMenuComponentProps> = ({ selectedTemplate, weaviateStatus, handleConnectWeaviate, fetchingWeaviateData, weaviateDataCount, weaviatePage, setWeaviatePage, weaviateCollectionName, weaviateData, generateData, selectedImageField, generateImage, retrieveWeaviateData, addGenerations, addCosts, addTimeSpent, APIEnvKeyAvailable, generations, cost, timeSpent, mode, imagePrompt, prompt, dataFields, generatedObjects, saveGeneratedObjects, handleDelete }) => {

    const [imageSize, setImageSize] = useState("1024x1024");
    const [imageStyle, setImageStyle] = useState("vivid")
    const [textTemperature, setTextTemperature] = useState(1)
    const [generationPodNumber, setGenerationPodNumber] = useState(4);

    const [includeImageBase64, setIncludeImageBase64] = useState(true);
    const [selectedBucket, setSelectedBucket] = useState('No Bucket');

    const [shouldGenerate, setShouldGenerate] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);

    const onGenerationComplete = () => {
        setShouldGenerate(false)
    }

    const onSaveComplete = () => {
        setShouldSave(false)
    }


    return (
        <div>
            <div className=' flex justify-start items-center mb-2 gap-4 ml-4'>

                <div onClick={() => { if (mode === "Generation") { setShouldSave(true) } }} className='flex items-center justify-center bg-green-500 hover:bg-green-400 shadow-lg p-4 h-24 w-24 rounded-lg duration-300 ease-in-out transform hover:scale-105' >
                    <div className="tooltip" data-tip="Save All">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <ImCheckmark />
                        </button>
                    </div>
                </div>

                <div onClick={() => { if (mode === "Generation") { setShouldGenerate(true) } }} className='flex items-center justify-center bg-blue-500 hover:bg-blue-400 shadow-lg p-4 h-24 w-24 rounded-lg duration-300 ease-in-out transform hover:scale-105' >
                    <div className="tooltip" data-tip="Generate All">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <FaRedoAlt />
                        </button>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title text-sm">Total Generations</div>
                        <div className="stat-value text-3xl">{generations}x</div>
                        <div className="stat-desc">Generations this session</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title text-sm">Estimated Cost</div>
                        <div className="stat-value text-3xl">{Number(cost.toFixed(2))}$</div>
                        <div className="stat-desc">Money wasted this session</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title text-sm">Summed Generation Time</div>
                        <div className="stat-value text-3xl">{Number(timeSpent.toFixed(2))}min</div>
                        <div className="stat-desc">Real time estimation ({Number((timeSpent / generationPodNumber).toFixed(2))}min)</div>
                    </div>

                </div>
            </div>

            <div className=''>
                {mode === "Generation" && (
                    <div className='flex-grow flex justify-between items-center gap-5 p-4'>
                        {Array.from({ length: generationPodNumber }, (_, index) => (
                            <GenerationPodComponent
                                selectedTemplate={selectedTemplate}
                                handleConnectWeaviate={handleConnectWeaviate}
                                weaviateCollectionName={weaviateCollectionName}
                                weaviateStatus={weaviateStatus}
                                key={`POD${index + 1}`}
                                id={`POD${index + 1}`}
                                addGenerations={addGenerations}
                                addCosts={addCosts}
                                selectedImageField={selectedImageField}
                                addTime={addTimeSpent}
                                imagePrompt={imagePrompt}
                                onSaveObject={saveGeneratedObjects}
                                prompt={prompt}
                                dataFields={dataFields}
                                imageSize={imageSize}
                                imageStyle={imageStyle}
                                temperature={textTemperature}
                                shouldGenerate={shouldGenerate}
                                onGenerationComplete={onGenerationComplete}
                                shouldSave={shouldSave}
                                onSaveComplete={onSaveComplete}
                                includeImageBase64={includeImageBase64}
                                selectedBucket={selectedBucket}
                                APIEnvKeyAvailable={APIEnvKeyAvailable}
                                generateData={generateData}
                                generateImage={generateImage}
                            />
                        ))}
                    </div>
                )}

                {mode === "Inspect" && (
                    <InspectModeComponent generatedObjects={generatedObjects} onDelete={handleDelete} selectedImageField={selectedImageField} />
                )}

                {mode === "Weaviate" && (
                    <InspectWeaviateComponent fetchingWeaviateData={fetchingWeaviateData} weaviateDataCount={weaviateDataCount} weaviatePage={weaviatePage} setWeaviatePage={setWeaviatePage} weaviateCollectionName={weaviateCollectionName} selectedImageField={selectedImageField} retrieveWeaviateData={retrieveWeaviateData} weaviateData={weaviateData} />
                )}
            </div>

            <SettingsModalComponent generationPodNumber={generationPodNumber} setGenerationPodNumber={setGenerationPodNumber} imageSize={imageSize} setImageSize={setImageSize} imageStyle={imageStyle} setImageStyle={setImageStyle} textTemperature={textTemperature} setTextTemperature={setTextTemperature} />
            <ExportModalComponent includeImageBase64={includeImageBase64} setIncludeImageBase64={setIncludeImageBase64} setSelectedBucket={setSelectedBucket} selectedBucket={selectedBucket} />

        </div>
    );
};

export default GenerationMenuComponent;
