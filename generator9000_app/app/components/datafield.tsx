'use client'

import React from 'react';
import { TiDelete } from "react-icons/ti";
import { DataField } from './types'

interface DataFieldComponentProps {
    dataField: DataField;
    _disabled: boolean;
    imageField: boolean;
    deleteDataField: () => void;
    updateDataField: (updatedField: Partial<DataField>) => void;
}

const DataFieldComponent: React.FC<DataFieldComponentProps> = ({ dataField, _disabled, imageField, deleteDataField, updateDataField }) => {
    return (
        <div>
            <div className='flex justify-between items-center gap-3 m-2'>
                {!_disabled && !imageField && (
                    <button className='p-2 shadow-lg rounded-lg bg-red-400 flex justify-center items-center gap-2 text-xs' onClick={deleteDataField}>
                        <TiDelete size={17} />
                    </button>
                )}
                {imageField && (
                    <p className='text-xs'>
                        Saving image to:
                    </p>
                )}
                <input
                    type="text"
                    value={dataField.name}
                    onChange={(e) => updateDataField({ name: e.target.value.replace(/\s+/g, '_') })}
                    placeholder="Field name"
                    className="input input-bordered w-full text-sm"
                    disabled={_disabled || imageField}
                />
                {!imageField && (<select
                    className="select select-bordered w-full max-w-xs text-xs"
                    value={dataField.type}
                    onChange={(e) => updateDataField({ type: e.target.value })}
                    disabled={_disabled}
                >
                    <option value="string">text</option>
                    <option value="string[]">text[]</option>
                    <option value="number">number</option>
                    <option value="number[]">number[]</option>
                </select>)}

                {!imageField && (
                    <textarea

                        className="textarea textarea-sm items-center text-center textarea-bordered w-full text-xs"
                        value={dataField.values.join(', ')} // Assuming values are comma-separated
                        onChange={(e) => updateDataField({ values: e.target.value.split(', ') })}
                        placeholder="Possible values"
                        disabled={_disabled}
                    ></textarea>)}
            </div>
        </div>
    );
};

export default DataFieldComponent;
