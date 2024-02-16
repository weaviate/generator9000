'use client'

import React, { useState, useEffect } from 'react';

import DataFieldComponent from './components/datafield'
import GenerationPodComponent from './components/generation_pod'
import InspectModeComponent from './components/inspectcomponent';
import { IoMdAddCircle } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid'; // Import UUID to generate unique IDs
import { DataField, initial_templates, Templates, Template, FieldValues } from './components/types'
import { MdOutgoingMail } from "react-icons/md";
import RiveComponent from '@rive-app/react-canvas';


export default function Home() {
  const [dataFields, setDataFields] = useState<DataField[]>([]);

  const [prompt, setPrompt] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("Empty"); // Track the selected template
  const [templates, setTemplates] = useState<Templates>(initial_templates);
  const [savedFieldValuesList, setSavedFieldValuesList] = useState<FieldValues[]>([]);
  const [mode, setMode] = useState<"Generation" | "Inspect">("Generation");


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

  const saveFieldValues = (fieldValues: FieldValues) => {
    setSavedFieldValuesList(prevList => [...prevList, fieldValues]);
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

  const handleDelete = (index: number) => {
    setSavedFieldValuesList(currentList => currentList.filter((_, i) => i !== index));
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedTemplate(name); // Update the selected template state
    const template = templates.templates.find(t => t.name === name);
    if (template) {
      setPrompt(template.prompt);
      setDataFields(template.datafields);
    }
  };

  const exportToJson = () => {
    const dataToSave = {
      prompt,
      dataFields,
      savedFieldValuesList
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToSave));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "exported_data.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const importFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const importedData = JSON.parse(result);
          setPrompt(importedData.prompt);
          setDataFields(importedData.dataFields);
          setSavedFieldValuesList(importedData.savedFieldValuesList);

          const newTemplate: Template = {
            name: "Current File",
            prompt: importedData.prompt,
            datafields: importedData.dataFields
          };

          setTemplates(prevTemplates => ({
            templates: [...prevTemplates.templates, newTemplate]
          }));
          setSelectedTemplate("Current File");
        }
      };
    }
  }

  return (
    <main className="p-8">
      <div className="navbar bg-base-100 shadow-lg rounded-lg">
        <div className="flex-none gap-2 ml-4">
          <div className="avatar">
            <div className="w-14 rounded-full shadow-lg">
              <img src="justacat.gif" />
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <div className="flex justify-center items-center">
            <RiveComponent
              src="generator_9000.riv"
              className="rive-container"
            />
          </div>
        </div>

        <div className='flex-none gap-4'>
          <input type="file" className="text-xs file-input file-input-md file-input-bordered" onChange={importFromJson} />
          <button className=" bg-green-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={exportToJson}>Export ({savedFieldValuesList.length})</button>
          <button className=" bg-blue-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => setMode(mode === "Generation" ? "Inspect" : "Generation")}>
            {mode === "Generation" ? "Inspect Objects" : "Generate Objects"}
          </button>
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


            {dataFields.length <= 0 && (
              <div className='my-2 text-xs font-light flex justify-start items-center opacity-50'>
                <p>No data fields</p>
              </div>
            )}

            {dataFields.map((field, index) => (
              <DataFieldComponent
                key={field.id}
                dataField={field}
                deleteDataField={() => deleteDataField(field.id)}
                updateDataField={(updatedField) => updateDataField(field.id, updatedField)}
              />
            ))}
            <div className='flex justify-center items-center mt-3'>
              <button className='p-4 flex justify-center items-center gap-2 rounded-lg shadow-lg bg-green-400 text-xs duration-300 ease-in-out transform hover:scale-105' onClick={addDataField}>
                <IoMdAddCircle />
              </button>
            </div>
          </div>
        </div>

        <div className='w-2/3 p-4 flex items-center justify-center gap-5'>
          {mode === "Generation" ? (
            <div className='flex justify-between items-center gap-5'>

              <GenerationPodComponent onSaveFieldValues={saveFieldValues} prompt={prompt} dataFields={dataFields} />

              <GenerationPodComponent onSaveFieldValues={saveFieldValues} prompt={prompt} dataFields={dataFields} />

              <GenerationPodComponent onSaveFieldValues={saveFieldValues} prompt={prompt} dataFields={dataFields} />

            </div>
          ) : (
            <InspectModeComponent savedFieldValuesList={savedFieldValuesList} onDelete={handleDelete} />
          )}
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
