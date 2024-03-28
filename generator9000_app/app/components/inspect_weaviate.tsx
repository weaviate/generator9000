'use client'


import React, { useState, useEffect } from 'react';
import { GeneratedObject, FlexibleDictionary } from './types'
import ObjectCard from './object_card'
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
    }, [weaviateCollectionName, weaviatePage]);

    useEffect(() => {
        setWeaviatePage(1)
    }, [weaviateCollectionName]);

    const truncateText = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    const nextPage = () => {
        if (weaviateData.length < 12) {
            setWeaviatePage(1)
        } else {
            setWeaviatePage(weaviatePage + 1)
        }
    }

    const previousPage = () => {
        if (weaviatePage == 1) {
            setWeaviatePage(1)
        } else {
            setWeaviatePage(weaviatePage - 1)
        }
    }



    return (
        <div>
            {fetchingWeaviateData ? (
                <div className='flex items-center justify-center mt-8'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className='flex items-center justify-center'>
                    <div className='flex flex-col justify-center items-center gap-3 mt-3'>
                        <p className='text-sm opacity-50'>{weaviateDataCount} Data Objects found in {weaviateCollectionName}</p>
                        <div className="join">
                            <button onClick={previousPage} className="join-item btn">«</button>
                            <button className="join-item btn">Page {weaviatePage}</button>
                            <button onClick={nextPage} className="join-item btn">»</button>
                        </div>
                    </div>
                </div>
            )}
            <div className='grid grid-cols-3 gap-4 justify-center items-center'>
                {weaviateData.map((fieldValues, index) => (
                    <ObjectCard index={index} fieldValues={fieldValues} selectedImageField={selectedImageField} />
                ))}
            </div>
        </div>
    );
};

export default InspectWeaviateComponent;
