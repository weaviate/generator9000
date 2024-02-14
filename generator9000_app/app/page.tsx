'use client'

import React, { useState, useEffect } from 'react';

import DataFieldComponent from './components/datafield'
import GenerationPodComponent from './components/generation_pod'
import { IoMdAddCircle } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid'; // Import UUID to generate unique IDs
import { DataField, templates } from './components/types'
import { MdOutgoingMail } from "react-icons/md";

export default function Home() {
  const [dataFields, setDataFields] = useState<DataField[]>([]);

  const [prompt, setPrompt] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("Empty"); // Track the selected template

  const addDataField = () => {
    const newDataField: DataField = {
      id: uuidv4(), // Generate a unique ID for each new data field
      name: "",
      type: "string",
      values: [],
    };
    setDataFields([...dataFields, newDataField]);
  };

  const deleteDataField = (id: string) => {
    setDataFields(dataFields.filter(field => field.id !== id));
  };

  const updateDataField = (id: string, updatedField: Partial<DataField>) => {
    setDataFields(dataFields.map(field => field.id === id ? { ...field, ...updatedField } : field));
  };

  const openDebugModal = () => {
    const modal = document.getElementById('debug_modal');

    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    } else {
      console.error('Debug modal not found');
      // Handle the case where the modal is not found, if necessary
    }
  }

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedTemplate(name); // Update the selected template state
    const template = templates.templates.find(t => t.name === name);
    if (template) {
      setPrompt(template.prompt);
      setDataFields(template.datafields);
    }
  };

  return (
    <main className="p-8">
      <div className="navbar bg-base-100 shadow-lg rounded-lg">
        <div className="flex-none gap-2 ml-4">
          <div className="avatar">
            <div className="w-14 rounded-full shadow-lg">
              <img src="justacat.gif" />
            </div>
          </div>
          <div className="avatar">
            <div className="w-14 rounded-full shadow-lg">
              <img src="gatitos-gatos.gif" />
            </div>
          </div>
          <div className="avatar">
            <div className="w-14 rounded-full shadow-lg">
              <img src="catwork.gif" />
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <button className="btn btn-ghost text-xl">Generator 9000</button>
        </div>

        <div className='flex-none gap-4'>
          <button className="btn text-xs btn-success">Save As</button>
          <button className="btn text-xs btn-accent">Load</button>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title text-xs">Objects</div>
              <div className="stat-value text-lg">100</div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center mt-4'>
        <div className='w-1/3'>
          <div className='p-2'>
            <div className='flex justify-between items-center mb-4'>
              <button className="btn btn-xs border-none shadow-none bg-transparent text-opacity-25 hover:text-opacity-100 hover:bg-transparent" onClick={openDebugModal}><MdOutgoingMail size={20} /></button>
              <p className=''>Prompt</p>
              <select value={selectedTemplate}
                onChange={handleTemplateChange}
                className="select select-sm select-bordered w-full max-w-xs">
                {templates.templates.map((template) => (
                  <option key={template.name} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <textarea className="textarea textarea-bordered w-full" placeholder="Enter your prompt here" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
          </div>
          <div className='p-2'>
            <p className=''>Data Fields</p>
            {dataFields.map((field, index) => (
              <DataFieldComponent
                key={field.id}
                dataField={field}
                deleteDataField={() => deleteDataField(field.id)}
                updateDataField={(updatedField) => updateDataField(field.id, updatedField)}
              />
            ))}
            <div className='flex justify-center items-center mt-3'>
              <button className='btn btn-sm btn-circle btn-success' onClick={addDataField}>
                <IoMdAddCircle />
              </button>
            </div>
          </div>
        </div>

        <div className='w-2/3 p-4 flex items-center justify-between gap-5'>
          <div className='w-1/3'>
            <GenerationPodComponent prompt={prompt} dataFields={dataFields} />
          </div>
          <div className='w-1/3'>
            <GenerationPodComponent prompt={prompt} dataFields={dataFields} />
          </div>
          <div className='w-1/3'>
            <GenerationPodComponent prompt={prompt} dataFields={dataFields} />
          </div>
        </div>
      </div>

      <dialog id="debug_modal" className="modal">
        <div className="modal-box">
          <div>
            <h3 className="font-bold text-lg">Prompt</h3>
            <pre className="py-4 text-xs">{prompt}</pre>
          </div>
          <div>
            <h3 className="font-bold text-lg">Data Fields</h3>
            <pre className="py-4 text-xs">{`${JSON.stringify(dataFields, null, 2)}`}</pre>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
}
