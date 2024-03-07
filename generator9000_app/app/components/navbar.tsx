'use client'


import React from 'react';
import { GeneratedObject } from './types'
import RiveComponent from '@rive-app/react-canvas';
import { FaKey } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

interface NavbarComponentProps {
    importAllFromJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
    exportAllToJson: () => void;
    handleExportJSON: () => void;
    setMode: (_mode: "Generation" | "Inspect") => void;
    mode: string;
    generatedObjects: GeneratedObject[];
    apiKeyAvailable: boolean;

}

const NavbarComponent: React.FC<NavbarComponentProps> = ({ generatedObjects, mode, apiKeyAvailable, importAllFromJson, exportAllToJson, setMode, handleExportJSON }) => {


    const openSettingsModal = () => {
        const modal = document.getElementById('settings_modal');

        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.error('Debug modal not found');
            // Handle the case where the modal is not found, if necessary
        }
    }

    const openKeyModal = () => {
        const modal = document.getElementById('key_modal');

        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.error('Debug modal not found');
            // Handle the case where the modal is not found, if necessary
        }
    }

    const openExportModal = () => {
        const modal = document.getElementById('export_modal');

        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.error('Debug modal not found');
            // Handle the case where the modal is not found, if necessary
        }
    }

    const handleClick = () => {
        // Open a new tab with the specified URL
        window.open("https://github.com/weaviate/generator9000", '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="navbar bg-base-100 shadow-lg rounded-lg">
            <div className="flex-none gap-2 ml-4">
                <div className="avatar">
                    <div className="w-14 rounded-full shadow-lg">
                        <img src="justacat.gif" />
                    </div>
                </div>
            </div>
            <div className='flex-1'>
                <div className="flex justify-center items-center">
                    <RiveComponent
                        src="generator_9000.riv"
                        className="rive-container"
                        stateMachines={"State Machine 1"}
                    />
                </div>
                <div className='justify-center items-center'>
                    <button className='p-2 shadow-lg rounded-full bg-green-200 hover:bg-green-300' onClick={handleClick}>
                        <FaGithub />
                    </button>
                </div>
            </div>

            <div className='flex-none justify-center items-center mr-5 gap-3'>
                {apiKeyAvailable ? (<p className='text-xs opacity-25'>OpenAI Key available</p>) : (<p className='text-xs text-red-400 font-bold'>OpenAI Key not available!</p>)}
                <button onClick={openKeyModal} className={`btn btn-circle border-2 ${apiKeyAvailable ? " border-green-400" : "border-dashed border-red-400"}`}>
                    <FaKey />
                </button>
            </div>

            <div className='flex-none gap-4'>
                <input type="file" className="text-xs file-input file-input-md file-input-bordered" onChange={importAllFromJson} />
                <div className="dropdown dropdown-bottom dropdown-end">
                    <button tabIndex={0} role="button" className=" bg-green-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105">Export</button>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li onClick={handleExportJSON}><a>Export Data</a></li>
                        <li onClick={exportAllToJson}><a>Export Template & Data</a></li>
                    </ul>
                </div>
                <button disabled={!apiKeyAvailable} className=" bg-blue-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => setMode(mode === "Generation" ? "Inspect" : "Generation")}>
                    {mode === "Generation" ? "Inspect Objects (" + generatedObjects.length + ")" : "Generate Objects"}
                </button>
                <button className=" bg-gray-300 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => { openExportModal() }}>Save Settings</button>
                <button className=" bg-gray-300 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => { openSettingsModal() }}>Generation Settings</button>

            </div>


        </div>
    );
};

export default NavbarComponent;
