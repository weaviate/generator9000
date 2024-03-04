'use client'

import React, { useState, useEffect } from 'react';

import NavbarComponent from './components/navbar';
import PromptMenuComponent from './components/prompt_menu';
import GenerationMenuComponent from './components/generation_menu';

import { DataField, initial_templates, Template, GeneratedObject } from './components/types'
import { exportAllToJson, importAllFromJson, exportJson } from './components/data_actions'

export default function Home() {
  const [dataFields, setDataFields] = useState<DataField[]>([]);

  const [prompt, setPrompt] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("Empty"); // Track the selected template
  const [templates, setTemplates] = useState<Template[]>(initial_templates);

  const [generatedObjects, setGeneratedObjects] = useState<GeneratedObject[]>([]);

  const [mode, setMode] = useState<"Generation" | "Inspect">("Generation");

  const [cost, setCost] = useState(0)
  const [generations, setGenerations] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Customize the message shown to the user
      // Note: Modern browsers often display a standard message regardless of this value due to security reasons.
      const message = 'Are you sure you want to leave? Any unsaved changes will be lost.';
      e.returnValue = message; // Legacy method for cross browser support
      return message; // Chrome requires returnValue to be set
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render


  const addGenerations = (add_generations: number) => {
    setGenerations(prevGenerations => prevGenerations + add_generations);
  }

  const addCosts = (add_costs: number) => {
    setCost(prevCost => prevCost + add_costs);
  }

  const addTimeSpent = (add_time: number) => {
    setTimeSpent(prevTimeSpent => prevTimeSpent + add_time);
  }


  const saveGeneratedObjects = (generatedObjects: GeneratedObject) => {
    setGeneratedObjects(prevList => [...prevList, generatedObjects]);
  };

  const handleDelete = (index: number) => {
    setGeneratedObjects(currentList => currentList.filter((_, i) => i !== index));
  };

  const handleExportAllToJSON = () => {
    exportAllToJson(prompt, imagePrompt, cost, generations, timeSpent, dataFields, generatedObjects)
  }

  const handleExportJSON = () => {
    exportJson(generatedObjects)
  }

  const handleImportAllFromJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = await importAllFromJson(event)

    setPrompt(data.prompt)
    setImagePrompt(data.imagePrompt)
    setDataFields(data.datafields)
    setGeneratedObjects(data.generatedObjects)
    setCost(data.cost)
    setGenerations(data.generations)
    setTimeSpent(data.timeSpent)
    templates.push(data.template)
    setSelectedTemplate(data.template.name)

  }

  return (
    <main className="p-8">

      <NavbarComponent importAllFromJson={handleImportAllFromJSON} exportAllToJson={handleExportAllToJSON} mode={mode} setMode={setMode} generatedObjects={generatedObjects} handleExportJSON={handleExportJSON} />

      <div className='flex justify-center mt-4'>
        <div className='w-1/3'>

          <PromptMenuComponent prompt={prompt} imagePrompt={imagePrompt} setPrompt={setPrompt} setImagePrompt={setImagePrompt} templates={templates} setSelectedTemplate={setSelectedTemplate} selectedTemplate={selectedTemplate} dataFields={dataFields} setDataFields={setDataFields} />

        </div>
        <div className='w-2/3'>

          <GenerationMenuComponent prompt={prompt} imagePrompt={imagePrompt} generations={generations} cost={cost} timeSpent={timeSpent} setGenerations={setGenerations} setCost={setCost} setTimeSpent={setTimeSpent} mode={mode} dataFields={dataFields} generatedObjects={generatedObjects} saveGeneratedObjects={saveGeneratedObjects} handleDelete={handleDelete} addCosts={addCosts} addGenerations={addGenerations} addTimeSpent={addTimeSpent} />

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
