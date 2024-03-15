'use client'


import React, { useRef, useEffect, useState } from 'react';
import { FaKey } from "react-icons/fa";

interface WeaviateConnectorComponentProps {
    weaviateStatus: "not connected" | "connecting" | "connected",
}

const WeaviateConnectorComponent: React.FC<WeaviateConnectorComponentProps> = ({ weaviateStatus }) => {

    const openWeaviateModal = () => {
        const modal = document.getElementById('weaviate_modal');

        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.error('Debug modal not found');
            // Handle the case where the modal is not found, if necessary
        }
    }

    return (
        <div className='flex-none justify-center items-center gap-3'>
            {weaviateStatus === "connected" ? (<p className='text-xs opacity-25'>Connected</p>) : (<p className='text-xs text-red-400 font-bold'>Not Connected</p>)}
            <button onClick={openWeaviateModal} className={`btn btn-circle border-2 ${weaviateStatus === "connected" ? " border-green-400" : "border-dashed border-red-400"}`}>
                <img src={"weaviate_logo.svg"} width="24" height="24" alt="Weaviate Logo" />
            </button>
        </div>
    );
};

export default WeaviateConnectorComponent;
