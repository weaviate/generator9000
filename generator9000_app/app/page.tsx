'use client'

import React, { useState, useEffect } from 'react';

import DataFieldComponent from './components/datafield'
import GenerationPodComponent from './components/generation_pod'
import InspectModeComponent from './components/inspectcomponent';
import { IoMdAddCircle } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid'; // Import UUID to generate unique IDs

import { DataField, initial_templates, Templates, Template, FieldValues } from './components/types'
import { MdOutgoingMail } from "react-icons/md";
import { BiObjectsVerticalBottom } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";
import RiveComponent from '@rive-app/react-canvas';

import { useRouter, useSearchParams, usePathname } from 'next/navigation'


export default function Home() {
  const [dataFields, setDataFields] = useState<DataField[]>([]);

  const [prompt, setPrompt] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("Empty"); // Track the selected template
  const [templates, setTemplates] = useState<Templates>(initial_templates);
  const [savedFieldValuesList, setSavedFieldValuesList] = useState<FieldValues[]>([]);
  const [mode, setMode] = useState<"Generation" | "Inspect">("Generation");

  const [imageSize, setImageSize] = useState("1024x1024");
  const [imageStyle, setImageStyle] = useState("vivid")

  const [cost, setCost] = useState(0)
  const [generations, setGenerations] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  const [textTemperature, setTextTemperature] = useState(1)

  const [generationPodNumber, setGenerationPodNumber] = useState(3);

  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {

    const _template = searchParams.get('template')

    if (_template) {
      setSelectedTemplate(_template)
      const template = templates.templates.find(t => t.name === _template);
      if (template) {
        setPrompt(template.prompt);
        setDataFields(template.datafields);
        setImagePrompt(template.imagePrompt)
      }
    }
    else {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('template', "Empty");
      router.push(`/?${newSearchParams}`, { scroll: false });
    }

  }, [searchParams]);


  const addGenerations = (add_generations: number) => {
    setGenerations(prevGenerations => prevGenerations + add_generations);
  }

  const addCosts = (add_costs: number) => {
    setCost(prevCost => prevCost + add_costs);
  }

  const addTimeSpent = (add_time: number) => {
    setTimeSpent(prevTimeSpent => prevTimeSpent + add_time);
  }


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

  const openSettingsModal = () => {
    const modal = document.getElementById('settings_modal');

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
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('template', name);
    router.push(`/?${newSearchParams}`, { scroll: false });
    const template = templates.templates.find(t => t.name === name);
    if (template) {
      setPrompt(template.prompt);
      setDataFields(template.datafields);
      setImagePrompt(template.imagePrompt)
    }
  };

  const exportToJson = () => {
    const dataToSave = {
      prompt,
      cost,
      generations,
      timeSpent,
      imagePrompt,
      dataFields,
      savedFieldValuesList
    };

    // Create a Blob from the data
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = url;
    downloadAnchorNode.download = "exported_data.json"; // Default file name; user can change it if their browser is set to ask
    document.body.appendChild(downloadAnchorNode); // Firefox requires the element to be in the DOM to trigger download
    downloadAnchorNode.click();
    downloadAnchorNode.remove(); // Clean up

    // Release the blob URL to free up resources
    URL.revokeObjectURL(url);
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
          setImagePrompt(importedData.imagePrompt)
          setCost(importedData.cost)
          setGenerations(importedData.generations)
          setTimeSpent(importedData.timeSpent)

          const newTemplate: Template = {
            name: "Current File",
            imagePrompt: importedData.imagePrompt,
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
              stateMachines={"State Machine 1"}
            />
          </div>
        </div>

        <div className='flex-none gap-4'>
          <input type="file" className="text-xs file-input file-input-md file-input-bordered" onChange={importFromJson} />
          <button className=" bg-green-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={exportToJson}>Export ({savedFieldValuesList.length})</button>
          <button className=" bg-blue-400 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => setMode(mode === "Generation" ? "Inspect" : "Generation")}>
            {mode === "Generation" ? "Inspect Objects" : "Generate Objects"}
          </button>
          <button className=" bg-gray-300 p-4 text-xs rounded-lg shadow-lg font-bold duration-300 ease-in-out transform hover:scale-105" onClick={() => { openSettingsModal() }}>Settings</button>
        </div>
      </div>
      <div className='flex justify-center mt-4'>
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

            <p className='text-xs font-light mb-1'>Data Prompt</p>
            <textarea className="textarea textarea-bordered w-full" placeholder="Enter your prompt here" value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
            <p className='text-xs font-light mb-1'>Image Prompt</p>
            <textarea className="textarea textarea-bordered w-full" placeholder="Enter your image prompt here" value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)}></textarea>

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

        <div className='w-2/3'>
          <div className=' flex justify-end items-center mb-2'>
            <div className="stats shadow">

              <div className="stat">
                <div className="stat-figure text-zinc-800">
                  <BiObjectsVerticalBottom size={30} />
                </div>
                <div className="stat-title text-sm">Total Generations</div>
                <div className="stat-value text-4xl">{generations}x</div>
                <div className="stat-desc">Generations done within this session</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-zinc-800">
                  <TbPigMoney size={30} />                </div>
                <div className="stat-title text-sm">Total Costs</div>
                <div className="stat-value text-4xl">{Number(cost.toFixed(2))}$</div>
                <div className="stat-desc">Money spent on this session</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-zinc-800">
                  <MdAccessTime size={30} />
                </div>
                <div className="stat-title text-sm">Total Generation Time</div>
                <div className="stat-value text-4xl">{Number(timeSpent.toFixed(2))}min</div>
                <div className="stat-desc">Time saved on this session (actual time {Number((timeSpent / 3).toFixed(2))}min)</div>
              </div>

            </div>
          </div>

          <div className=''>
            {mode === "Generation" ? (
              <div className='flex justify-center items-center gap-5 p-4'>
                {Array.from({ length: generationPodNumber }, (_, index) => (
                  <GenerationPodComponent
                    key={`POD${index + 1}`}
                    id={`POD${index + 1}`}
                    addGenerations={addGenerations}
                    addCosts={addCosts}
                    addTime={addTimeSpent}
                    imagePrompt={imagePrompt}
                    onSaveFieldValues={saveFieldValues}
                    prompt={prompt}
                    dataFields={dataFields}
                    imageSize={imageSize}
                    imageStyle={imageStyle}
                    temperature={textTemperature}
                  />
                ))}
              </div>
            ) : (
              <InspectModeComponent savedFieldValuesList={savedFieldValuesList} onDelete={handleDelete} />
            )}
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


      <dialog id="settings_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Settings</h3>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Number of Generation Pods</span>
            </label>
            <input type="number" className="input input-bordered" min="1" max="10" // Assuming a max of 10 for UI/UX reasons
              value={generationPodNumber}
              onChange={(e) => setGenerationPodNumber(parseInt(e.target.value) || 1)} // Ensure we always have a valid number
            />
          </div>

          {/* Image Size Selection */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Image Size</span>
            </label>
            <select className="select select-bordered"
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}>
              <option value="1024x1024">1024x1024</option>
              <option value="1792x1024">1792x1024</option>
              <option value="1024x1792">1024x1792</option>
            </select>
          </div>

          {/* Image Style Selection */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Image Style</span>
            </label>
            <select className="select select-bordered"
              value={imageStyle}
              onChange={(e) => setImageStyle(e.target.value)}>
              <option value="natural">Natural</option>
              <option value="vivid">Vivid</option>
            </select>
          </div>

          {/* Temperature Slider */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Text Temperature (0 - 1)</span>
            </label>
            <input type="range" min="0" max="1" step="0.01"
              className="range range-xs"
              value={textTemperature}
              onChange={(e) => setTextTemperature(parseFloat(e.target.value))} />
            <div className="w-full flex justify-between text-xs px-2">
              <span>0</span>
              <span>1</span>
            </div>
          </div>


          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-green-400 hover:bg-blue-300" onClick={() => { }} >Apply</button>
              <button className="btn ml-2">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

    </main>
  );
}
