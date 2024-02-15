// In InspectModeComponent.js
import React from 'react';
import { DataField, FieldValues } from './types'

interface InspectComponentProps {
    savedFieldValuesList: FieldValues[];

}

const InspectModeComponent: React.FC<InspectComponentProps> = ({ savedFieldValuesList }) => {
    return (
        <div className='grid grid-cols-3 gap-4 justify-center items-center'>
            {savedFieldValuesList.map((fieldValues, index) => (
                <div key={index} className="card bg-base-100 shadow-xl m-2">
                    <div className="card-body">
                        <h2 className="card-title text-base">Object #{index + 1}</h2>
                        {fieldValues.imageBase64 ? (
                            <img src={fieldValues.imageBase64} alt={`Uploaded Object ${index + 1}`} className="max-w-full h-auto" />
                        ) : (
                            <p>No Image</p>
                        )}
                        <pre className='text-xs'>{JSON.stringify({ ...fieldValues, imageBase64: undefined }, null, 2)}</pre>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InspectModeComponent;
