import React, { useState } from 'react';
import { GeneratedObject } from './types'
import { TiDelete } from "react-icons/ti";

interface InspectComponentProps {
    generatedObjects: GeneratedObject[];
    onDelete: (index: number) => void;

}

const InspectModeComponent: React.FC<InspectComponentProps> = ({ generatedObjects, onDelete }) => {

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

    return (
        <div className='grid grid-cols-3 gap-4 justify-center items-center'>
            {generatedObjects.map((fieldValues, index) => (
                <div key={index} className="card bg-base-100 shadow-xl m-2">
                    <div className="card-body">
                        <div className='flex justify-between gap-4 items-center'>
                            <h2 className="card-title text-base">Object #{index + 1}</h2>
                            <button onClick={() => handleDeleteObjectModal(index)} className="p-2 bg-red-400 shadow-md rounded-xl duration-300 ease-in-out transform hover:scale-105 max-w-sm"><TiDelete /></button>
                        </div>
                        {fieldValues.imageBase64 ? (
                            <img src={fieldValues.imageBase64} alt={`Uploaded Object ${index + 1}`} className="max-w-full h-auto" />
                        ) : (
                            <p>No Image</p>
                        )}
                        <pre className='text-xs'>{JSON.stringify({ ...fieldValues, imageBase64: undefined }, null, 2)}</pre>
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
