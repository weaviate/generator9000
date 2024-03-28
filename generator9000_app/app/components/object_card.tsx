'use client'


import React, { useState, useEffect } from 'react';
import { GeneratedObject, FlexibleDictionary } from './types'
import { TiDelete } from "react-icons/ti";

interface ObjectCardProps {
    index: number
    fieldValues: FlexibleDictionary;
    selectedImageField: string
}

const ObjectCardComponent: React.FC<ObjectCardProps> = ({ index, fieldValues, selectedImageField }) => {

    const truncateText = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    return (
        <div key={index} className="card bg-base-100 shadow-xl border-gray border mt-5">
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


                {fieldValues["imageBase64"] && !fieldValues[selectedImageField] ? (
                    <img src={fieldValues["imageBase64"]} alt={`Uploaded Object ${index + 1}`} className="max-w-full h-auto rounded-lg shadow-lg" />
                ) : (
                    <p></p>
                )}

                <div className='flex flex-col gap-2 h-[25vh] overflow-auto w-full'>
                    {Object.entries(fieldValues).map(([key, value]) => {
                        if (key != 'imageBase64' && key != 'imageURL' && key != selectedImageField) {
                            return (
                                <div key={key} className="flex flex-col">
                                    <h3 className="font-bold text-sm">{key}</h3>
                                    <p className='text-sm'>{typeof value === 'string' ? truncateText(value) : JSON.stringify(value, null, 2)}</p>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>

    );
};

export default ObjectCardComponent;
