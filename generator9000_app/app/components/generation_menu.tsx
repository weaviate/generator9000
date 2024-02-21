import React, { useState } from 'react';

import SettingsModalComponent from './settings_modal';
import { DataField, GeneratedObject } from './types'

import { BiObjectsVerticalBottom } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";

import { FaRedoAlt } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";

import GenerationPodComponent from './generation_pod'
import InspectModeComponent from './inspect';

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

    setGenerations: (_n: number) => void;
    setCost: (_n: number) => void;
    setTimeSpent: (_n: number) => void;
    saveGeneratedObjects: (generatedObjects: GeneratedObject) => void;
    handleDelete: (index: number) => void;
}

const GenerationMenuComponent: React.FC<GenerationMenuComponentProps> = ({ generations, cost, timeSpent, mode, imagePrompt, prompt, dataFields, generatedObjects, setGenerations, setCost, setTimeSpent, saveGeneratedObjects, handleDelete }) => {

    const [imageSize, setImageSize] = useState("1024x1024");
    const [imageStyle, setImageStyle] = useState("vivid")
    const [textTemperature, setTextTemperature] = useState(1)
    const [generationPodNumber, setGenerationPodNumber] = useState(5);

    const [includeImageBase64, setIncludeImageBase64] = useState(true);
    const [selectedBucket, setSelectedBucket] = useState('No Bucket');

    const [shouldGenerate, setShouldGenerate] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);

    const addGenerations = (add_generations: number) => {
        setGenerations(generations + add_generations);
    }

    const addCosts = (add_costs: number) => {
        setCost(cost + add_costs);
    }

    const addTimeSpent = (add_time: number) => {
        setTimeSpent(timeSpent + add_time);
    }

    const onGenerationComplete = () => {
        setShouldGenerate(false)
    }

    const onSaveComplete = () => {
        setShouldSave(false)
    }


    return (
        <div>
            <div className=' flex justify-end items-center mb-2 gap-5'>

                <div onClick={() => { setShouldSave(true) }} className='flex items-center justify-center bg-emerald-400 hover:bg-emerald-300 shadow-lg p-4 h-24 w-24 rounded-lg duration-300 ease-in-out transform hover:scale-105' >
                    <div className="tooltip" data-tip="Save All">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <ImCheckmark />
                        </button>
                    </div>
                </div>

                <div onClick={() => { setShouldGenerate(true) }} className='flex items-center justify-center bg-cyan-400 hover:bg-cyan-300 shadow-lg p-4 h-24 w-24 rounded-lg duration-300 ease-in-out transform hover:scale-105' >
                    <div className="tooltip" data-tip="Generate All">
                        <button className='btn bg-transparent hover:bg-transparent btn-ghost'>
                            <FaRedoAlt />
                        </button>
                    </div>
                </div>

                <div className="stats shadow">

                    <div className="stat">
                        <div className="stat-figure text-zinc-800">
                            <BiObjectsVerticalBottom size={30} />
                        </div>
                        <div className="stat-title text-sm">Total Generations</div>
                        <div className="stat-value text-4xl">{generations}x</div>
                        <div className="stat-desc">Generations done within this session</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-zinc-800">
                            <TbPigMoney size={30} />                </div>
                        <div className="stat-title text-sm">Total Costs</div>
                        <div className="stat-value text-4xl">{Number(cost.toFixed(2))}$</div>
                        <div className="stat-desc">Money spent on this session</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-zinc-800">
                            <MdAccessTime size={30} />
                        </div>
                        <div className="stat-title text-sm">Total Generation Time</div>
                        <div className="stat-value text-4xl">{Number(timeSpent.toFixed(2))}min</div>
                        <div className="stat-desc">Time saved on this session (actual time {Number((timeSpent / 3).toFixed(2))}min)</div>
                    </div>

                </div>
            </div>

            <div className=''>
                {mode === "Generation" ? (
                    <div className='flex-grow flex justify-between items-center gap-5 p-4'>
                        {Array.from({ length: generationPodNumber }, (_, index) => (
                            <GenerationPodComponent
                                key={`POD${index + 1}`}
                                id={`POD${index + 1}`}
                                addGenerations={addGenerations}
                                addCosts={addCosts}
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
                            />
                        ))}
                    </div>
                ) : (
                    <InspectModeComponent generatedObjects={generatedObjects} onDelete={handleDelete} />
                )}
            </div>

            <SettingsModalComponent generationPodNumber={generationPodNumber} setGenerationPodNumber={setGenerationPodNumber} imageSize={imageSize} setImageSize={setImageSize} imageStyle={imageStyle} setImageStyle={setImageStyle} textTemperature={textTemperature} setTextTemperature={setTextTemperature} />
            <ExportModalComponent includeImageBase64={includeImageBase64} setIncludeImageBase64={setIncludeImageBase64} setSelectedBucket={setSelectedBucket} selectedBucket={selectedBucket} />

        </div>
    );
};

export default GenerationMenuComponent;
