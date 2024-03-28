'use client'


import React, { useState } from 'react';
import { GeneratedObject } from './types'
import { TiDelete } from "react-icons/ti";
import ObjectCard from './object_card'

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
        <div>
            <div className='flex justify-center items-center mt-5'>
                <p className='opacity-50 text-sm'>{generatedObjects.length} local saved objects</p>
            </div>
            <div className='grid grid-cols-3 gap-4 justify-center items-center'>
                {generatedObjects.map((fieldValues, index) => (
                    <ObjectCard index={index} fieldValues={fieldValues} selectedImageField={selectedImageField} />
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
        </div>
    );
};

export default InspectModeComponent;
