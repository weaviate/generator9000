'use client'


import React from 'react';


interface ExportModalComponentProps {
    includeImageBase64: boolean;
    setIncludeImageBase64: (_b: boolean) => void;
    selectedBucket: string;
    setSelectedBucket: (_s: string) => void;
}

const ExportModalComponent: React.FC<ExportModalComponentProps> = ({ includeImageBase64, setIncludeImageBase64, selectedBucket, setSelectedBucket }) => {


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIncludeImageBase64(e.target.checked);
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBucket(e.target.value);
    };

    return (
        <dialog id="export_modal" className="modal">

            <div className="modal-box">
                <h3 className="font-bold text-lg">Save Settings</h3>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Include ImageBase64?</span>
                        <input type="checkbox" checked={includeImageBase64} onChange={handleCheckboxChange} className="checkbox checkbox-primary" />
                    </label>
                </div>
                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text">Select Bucket:</span>
                    </label>
                    <select disabled={true} value={selectedBucket} onChange={handleDropdownChange} className="select select-primary w-full max-w-xs">
                        <option>No Bucket</option>
                        <option>AWS Bucket</option>
                    </select>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn bg-green-400 hover:bg-blue-300" onClick={() => { }} >Accept</button>
                        <button className="btn ml-2">Cancel</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default ExportModalComponent;
