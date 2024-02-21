import React from 'react';
import { GeneratedObject } from './types'
import RiveComponent from '@rive-app/react-canvas';

interface NavbarComponentProps {
    importAllFromJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
    exportAllToJson: () => void;
    setMode: (_mode: "Generation" | "Inspect") => void;
    mode: string;
    generatedObjects: GeneratedObject[];

}

const NavbarComponent: React.FC<NavbarComponentProps> = ({ generatedObjects, mode, importAllFromJson, exportAllToJson, setMode }) => {


    const openSettingsModal = () => {
        const modal = document.getElementById('settings_modal');

        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.error('Debug modal not found');
            // Handle the case where the modal is not found, if necessary
        }
    }

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
            </div>

            <div className='flex-none gap-4'>
                <input type="file" className="text-xs file-input file-input-md file-input-bordered" onChange={importAllFromJson} />
                <button className=" bg-green-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={exportAllToJson}>Export</button>
                <button className=" bg-blue-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => setMode(mode === "Generation" ? "Inspect" : "Generation")}>
                    {mode === "Generation" ? "Inspect Objects (" + generatedObjects.length + ")" : "Generate Objects"}
                </button>
                <button className=" bg-gray-300 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => { openSettingsModal() }}>Settings</button>
            </div>


        </div>
    );
};

export default NavbarComponent;
