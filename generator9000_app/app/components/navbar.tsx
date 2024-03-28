'use client'


import React, { useRef, useEffect } from 'react';
import { GeneratedObject } from './types'
import RiveComponent from '@rive-app/react-canvas';
import { FaKey } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import WeaviateConnectorComponent from './weaviate_connector';
import { IoSettingsSharp } from "react-icons/io5";
import { FaFileExport } from "react-icons/fa6";
import { FaFileImport } from "react-icons/fa6";

interface NavbarComponentProps {
    importAllFromJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
    exportAllToJson: () => void;
    handleExportJSON: () => void;
    setMode: (_mode: "Generation" | "Inspect" | "Weaviate") => void;
    mode: string;
    generatedObjects: GeneratedObject[];
    apiKeyAvailable: boolean;
    weaviateStatus: "not connected" | "connecting" | "connected",

}

const NavbarComponent: React.FC<NavbarComponentProps> = ({ weaviateStatus, generatedObjects, mode, apiKeyAvailable, importAllFromJson, exportAllToJson, setMode, handleExportJSON }) => {

    const soundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // This ensures Audio is defined and used only on the client side
        soundRef.current = new Audio("maxwell.wav"); // Adjust the path as necessary
    }, []);

    const playSound = () => {
        if (soundRef.current) {
            soundRef.current.play();
        }
    };

    const stopSound = () => {
        if (soundRef.current) {
            soundRef.current.pause();
            soundRef.current.currentTime = 0; // Rewind to the start
        }
    };

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
        <div className="navbar bg-base-100 border-gray border-b">
            <div className="flex-none gap-2 ml-4">
                <div className="avatar">
                    <div className="w-12 rounded-full shadow-lg">
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
                        onMouseEnter={playSound}
                        onMouseLeave={stopSound}
                    />
                </div>
            </div>

            <div className='flex-none justify-center items-center gap-3'>
                {apiKeyAvailable ? (<p className='text-xs opacity-25'>OpenAI Key set</p>) : (<p className='text-xs text-red-400 font-bold'>OpenAI Key not set!</p>)}
                <button onClick={openKeyModal} className={`btn btn-circle border-2 ${apiKeyAvailable ? " border-green-400" : "border-dashed border-red-400"}`}>
                    <FaKey />
                </button>
            </div>

            <div className="hidden sm:block h-10 bg-gray-400 opacity-50 w-px mx-4"></div>

            <WeaviateConnectorComponent weaviateStatus={weaviateStatus} />

            <div className="hidden sm:block h-10 bg-gray-400 opacity-50 w-px mx-4"></div>

            <div className='flex-none gap-4'>
                <div className='flex justify-center items-center'>
                    <button onClick={() => document.getElementById("FileInputButton")?.click()} className="bg-green-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105"><FaFileImport size={15} /></button>
                    <input id="FileInputButton" type="file" className="hidden" onChange={importAllFromJson} />

                </div>
                <div className="dropdown dropdown-bottom dropdown-end">
                    <button tabIndex={0} role="button" className=" bg-blue-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105"><FaFileExport size={15} /></button>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li onClick={handleExportJSON}><a>Export Data</a></li>
                        <li onClick={exportAllToJson}><a>Export Template & Data</a></li>
                    </ul>
                </div>

                <div className="dropdown dropdown-bottom dropdown-end">
                    <button tabIndex={0} role="button" className=" bg-gray-300 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105"><IoSettingsSharp size={15} /></button>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li onClick={() => { openExportModal() }}><a>Save Settings</a></li>
                        <li onClick={() => { openSettingsModal() }}><a>Generation Settings</a></li>
                    </ul>
                </div>

                <div className="hidden sm:block h-10 bg-gray-400 opacity-50 w-px"></div>

                <button disabled={!apiKeyAvailable} className=" bg-pink-300 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => setMode(mode === "Generation" ? "Inspect" : "Generation")}>
                    {mode === "Generation" ? "Local Objects (" + generatedObjects.length + ")" : "Generate Objects"}
                </button>

                {weaviateStatus === "connected" && (
                    <button className=" bg-green-300 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => setMode("Weaviate")}>
                        Weaviate Objects
                    </button>
                )}

                <div className="hidden sm:block h-10 bg-gray-400 opacity-50 w-px"></div>

                <div className='justify-center items-center'>
                    <button className='p-3 shadow-lg rounded-full bg-gray-50 hover:bg-green-300' onClick={handleClick}>
                        <FaGithub />
                    </button>
                </div>

            </div>


        </div>
    );
};

export default NavbarComponent;
