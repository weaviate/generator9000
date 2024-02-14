'use client'

import React from 'react';
import { TiDelete } from "react-icons/ti";
import { DataField } from './types'

interface DataFieldComponentProps {
    dataField: DataField;
    deleteDataField: () => void;
    updateDataField: (updatedField: Partial<DataField>) => void;
}

const DataFieldComponent: React.FC<DataFieldComponentProps> = ({ dataField, deleteDataField, updateDataField }) => {
    return (
        <div>
            <div className='flex justify-between items-center gap-3 m-2'>
                <button className='btn btn-sm btn-circle btn-error' onClick={deleteDataField}>
                    <TiDelete size={17} />
                </button>
                <input
                    type="text"
                    value={dataField.name}
                    onChange={(e) => updateDataField({ name: e.target.value })}
                    placeholder="Field name"
                    className="input input-bordered w-full text-sm"
                />
                <select
                    className="select select-bordered w-full max-w-xs text-xs"
                    value={dataField.type}
                    onChange={(e) => updateDataField({ type: e.target.value })}
                >
                    <option value="string">string</option>
                    <option value="string[]">string[]</option>
                    <option value="number">number</option>
                    <option value="number[]">number[]</option>
                </select>
                <textarea
                    className="textarea textarea-sm items-center text-center textarea-bordered w-full text-xs"
                    value={dataField.values.join(', ')} // Assuming values are comma-separated
                    onChange={(e) => updateDataField({ values: e.target.value.split(', ') })}
                    placeholder="Possible values"
                ></textarea>
            </div>
        </div>
    );
};

export default DataFieldComponent;
