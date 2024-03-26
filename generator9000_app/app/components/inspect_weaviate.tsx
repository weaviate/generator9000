'use client'


import React, { useState, useEffect } from 'react';
import { GeneratedObject, FlexibleDictionary } from './types'
import { TiDelete } from "react-icons/ti";

interface InspectWeaviateProps {
    retrieveWeaviateData: () => void
    weaviateData: FlexibleDictionary[];
    selectedImageField: string;
    weaviateCollectionName: string;

    fetchingWeaviateData: boolean;
    weaviateDataCount: number;
    weaviatePage: number;
    setWeaviatePage: (_n: number) => void;
}

const InspectWeaviateComponent: React.FC<InspectWeaviateProps> = ({ fetchingWeaviateData, weaviateDataCount, weaviatePage, setWeaviatePage, weaviateData, weaviateCollectionName, selectedImageField, retrieveWeaviateData }) => {

    useEffect(() => {
        retrieveWeaviateData()

    }, [weaviateCollectionName]);

    const truncateText = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    return (
        <div>
            {fetchingWeaviateData ? (
                <div className='flex items-center justify-center mt-8'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className='flex items-center justify-center mt-8'>
                    <p>{weaviateDataCount} Data objects</p>
                </div>
            )}
            <div className='grid grid-cols-3 gap-4 justify-center items-center'>
                {weaviateData.map((fieldValues, index) => (
                    <div key={index} className="card bg-base-100 shadow-xl m-2">
                        <div className="card-body">
                            <div className='flex justify-between gap-4 items-center'>
                                {fieldValues.id ? (
                                    <h2 className="card-title text-sm">{fieldValues.id}</h2>
                                ) : (
                                    <h2 className="card-title text-sm">Object #{index + 1}</h2>
                                )}
                            </div>

                            {fieldValues[selectedImageField] ? (
                                <img src={fieldValues[selectedImageField]} alt={`Uploaded Object ${index + 1}`} className="max-w-full h-auto rounded-lg shadow-lg" />
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
            </div>
        </div>
    );
};

export default InspectWeaviateComponent;
