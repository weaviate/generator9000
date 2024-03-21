'use client'


import React, { useState } from 'react';
import { GeneratedObject } from './types'
import { TiDelete } from "react-icons/ti";

interface InspectComponentProps {
    generatedObjects: GeneratedObject[];
    selectedImageField: string;
    onDelete: (index: number) => void;

}

const InspectModeComponent: React.FC<InspectComponentProps> = ({ generatedObjects, selectedImageField, onDelete }) => {

    const [deleteCandidateIndex, setDeleteCandidateIndex] = useState<number | null>(null);

    const handleDeleteObjectModal = (index: number) => {
        // Update the state to reflect the current candidate for deletion
        setDeleteCandidateIndex(index);
        // Show the modal
        const modal = document.getElementById('delete_inpect_object_modal');
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.error('Modal element not found');
        }
    }

    const confirmDeletion = () => {
        if (deleteCandidateIndex !== null) {
            onDelete(deleteCandidateIndex);
            // Optionally, close the modal here if needed
        }
        // Reset the candidate index after deletion
        setDeleteCandidateIndex(null);
    }

    const truncateText = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    return (
        <div className='grid grid-cols-3 gap-4 justify-center items-center'>
            {generatedObjects.map((fieldValues, index) => (
                <div key={index} className="card bg-base-100 shadow-xl m-2">
                    <div className="card-body">
                        <div className='flex justify-between gap-4 items-center'>
                            {fieldValues.id ? (
                                <h2 className="card-title text-sm">{fieldValues.id}</h2>
                            ) : (
                                <h2 className="card-title text-sm">Object #{index + 1}</h2>
                            )}

                            <button onClick={() => handleDeleteObjectModal(index)} className="p-2 bg-red-400 shadow-md rounded-xl duration-300 ease-in-out transform hover:scale-105 max-w-sm"><TiDelete /></button>
                        </div>
                        {fieldValues.imageBase64 ? (
                            <img src={fieldValues.imageBase64} alt={`Uploaded Object ${index + 1}`} className="max-w-full h-auto rounded-lg shadow-lg" />
                        ) : (
                            <p></p>
                        )}
                        {fieldValues.imageURL ? (
                            <img src={fieldValues.imageURL} alt={`Uploaded Object ${index + 1}`} className="max-w-full h-auto" />
                        ) : (
                            <p></p>
                        )}
                        {Object.entries(fieldValues).map(([key, value]) => {
                            if (key != 'imageBase64' && key != 'imageURL' && key != selectedImageField) {
                                return (
                                    <div key={key} className="p-2">
                                        <h3 className="font-bold">{key}</h3>
                                        <p>{typeof value === 'string' ? truncateText(value) : JSON.stringify(value, null, 2)}</p>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            ))}

            <dialog id="delete_inpect_object_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete Object?</h3>
                    <p className="py-4">Do you want to delete the object?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-error" onClick={confirmDeletion} >Delete</button>
                            <button className="btn ml-2" onClick={() => setDeleteCandidateIndex(null)}>No</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default InspectModeComponent;
