'use client'

import React, { useState, useEffect } from 'react';

import { Suspense } from "react"

import NavbarComponent from './components/navbar';
import PromptMenuComponent from './components/prompt_menu';
import GenerationMenuComponent from './components/generation_menu';
import { IoMdAlert } from "react-icons/io";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";

import { get_API_Status, connect_weaviate } from './actions'

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

  const [APIKey, setAPIKey] = useState("")
  const [selectedAPIKey, setSelectedAPIKey] = useState("")
  const [APIKeyEnvAvailable, setAPIKeyEnvAvailable] = useState(false)
  const [saveInBrowser, setSaveInBrowser] = useState(true)

  const [weaviateURL, setWeaviateURL] = useState("")
  const [weaviateKey, setWeaviateKey] = useState("")
  const [saveWeaviateCredentials, setSaveWeaviateCredentials] = useState(true)
  const [weaviateStatus, setWeaviateStatus] = useState<"not connected" | "connecting" | "connected">("not connected")
  const [selectedCollection, setSelectedConnection] = useState("")
  const [collection, setCollection] = useState<string[]>([])

  const [cost, setCost] = useState(0)
  const [generations, setGenerations] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  const [generateData, setGenerateData] = useState(true)
  const [generateImage, setGenerateImage] = useState(true)

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

  useEffect(() => {

    getAPIStatus()
    const APIKey = localStorage.getItem('Generator9000_APIKEY');
    if (APIKey) {
      setSelectedAPIKey(APIKey)
      setAPIKey(APIKey)
    }

    const weaviate_key = localStorage.getItem('Generator9000_Weaviate_URL');

    if (weaviate_key) {
      setWeaviateKey(weaviate_key)
    }

    const weaviate_url = localStorage.getItem('Generator9000_Weaviate_KEY');

    if (weaviate_url) {
      setWeaviateURL(weaviate_url)
    }

    handleConnectWeaviate()

  }, []);

  async function getAPIStatus() {
    try {
      const status = await get_API_Status();
      if (status) {
        setAPIKeyEnvAvailable(status);
      }
    } catch (error) {
      console.error('Failed to get API status:', error);
    }
  }

  const setGenerateOptions = (data: boolean, image: boolean) => {
    setGenerateData(data)
    setGenerateImage(image)
  }

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

  const handleConnectWeaviate = async () => {
    if (saveWeaviateCredentials) {
      localStorage.setItem('Generator9000_Weaviate_URL', weaviateURL);
      localStorage.setItem('Generator9000_Weaviate_KEY', weaviateKey);
    }

    if (weaviateKey && weaviateURL && selectedAPIKey) {
      setWeaviateStatus("connecting")
      const collections_payload: any = await connect_weaviate(weaviateURL, weaviateKey, selectedAPIKey)
      if (collections_payload) {

        if (collections_payload.error != "") {
          setCollection([])
          setSelectedConnection("")
          setWeaviateStatus("not connected")
        } else {
          console.log(collections_payload.classes)
          setCollection(collections_payload.classes)
          setSelectedConnection("Create new")
          setWeaviateStatus("connected")
        }
      } else {
        setWeaviateStatus("not connected")
      }
    } else {
      setWeaviateStatus("not connected")
    }

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

  const handleAPIKeySet = () => {
    setSelectedAPIKey(APIKey)

    if (saveInBrowser) {
      localStorage.setItem('Generator9000_APIKEY', APIKey);
    }
  }

  const clearAPIKey = () => {
    setSelectedAPIKey("")
    setAPIKey("")
    localStorage.removeItem('Generator9000_APIKEY')
  }

  return (
    <main className="p-8">

      <NavbarComponent weaviateStatus={weaviateStatus} importAllFromJson={handleImportAllFromJSON} exportAllToJson={handleExportAllToJSON} mode={mode} setMode={setMode} generatedObjects={generatedObjects} handleExportJSON={handleExportJSON} apiKeyAvailable={APIKeyEnvAvailable || selectedAPIKey != ""} />

      <div className='flex justify-center mt-4'>
        <div className='w-1/3'>
          <Suspense>
            <PromptMenuComponent setGenerateOptions={setGenerateOptions} prompt={prompt} imagePrompt={imagePrompt} setPrompt={setPrompt} setImagePrompt={setImagePrompt} templates={templates} setSelectedTemplate={setSelectedTemplate} selectedTemplate={selectedTemplate} dataFields={dataFields} setDataFields={setDataFields} />
          </Suspense>
        </div>
        <div className='w-2/3'>

          <GenerationMenuComponent generateData={generateData}
            generateImage={generateImage} APIEnvKeyAvailable={APIKeyEnvAvailable} APISetKey={selectedAPIKey} prompt={prompt} imagePrompt={imagePrompt} generations={generations} cost={cost} timeSpent={timeSpent} setGenerations={setGenerations} setCost={setCost} setTimeSpent={setTimeSpent} mode={mode} dataFields={dataFields} generatedObjects={generatedObjects} saveGeneratedObjects={saveGeneratedObjects} handleDelete={handleDelete} addCosts={addCosts} addGenerations={addGenerations} addTimeSpent={addTimeSpent} />

        </div>
      </div>

      <dialog id="debug_modal" className="modal">
        <div className="modal-box">
          <div>
            <h3 className="font-bold text-lg">Data Prompt</h3>
            <pre className="py-4 text-xs">{prompt}</pre>
          </div>
          <div>
            <h3 className="font-bold text-lg">Image Prompt</h3>
            <pre className="py-4 text-xs">{imagePrompt}</pre>
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

      <dialog id="key_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Setup OpenAI Key</h3>
          <p className="py-4 text-xs">You can set your OpenAI API Key here:</p>
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
            <input type="password" className="grow" value={APIKey} onChange={(e) => { setAPIKey(e.target.value) }} />
          </label>
          <label className="cursor-pointer label">
            <span className="label-text text-xs text-light">Remember key in browser</span>
            <input type="checkbox" className="checkbox checkbox-sm" checked={saveInBrowser} onChange={(e) => { setSaveInBrowser(e.target.checked) }} />
          </label>
          <div className='flex justify-center items-center gap-3 bg-red-300 rounded-lg shadow-lg mt-2'>
            <IoMdAlert />
            <p className="py-4 text-xs">Generating data will produce costs on your OpenAI key. Use with caution!</p>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button type='button' onClick={handleAPIKeySet} className="btn bg-green-400 hover:bg-green-300 mr-3">Set Key</button>
              <button type='button' onClick={clearAPIKey} className="btn bg-pink-300 hover:bg-pink-200 mr-3">Clear Key</button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="weaviate_modal" className="modal">
        <div className="modal-box">
          <div className='flex items-center justify-start gap-2'>
            <h3 className="font-bold text-lg">Setup Weaviate</h3>
          </div>

          <details className="collapse collapse-arrow mt-5 bg-gray-100 shadow-lg items-center">
            <summary className="collapse-title items-center">How to setup Weaviate?</summary>
            <div className="collapse-content">
              <p className='text-sm font-light'>Connect to Weaviate to automatically ingest generated objects.</p>
              <p className='text-sm font-light mt-2'>Weaviate is an AI-native vector database used for many AI applications. You can create a free cluster on Weaviate Cloud Services (WCS) to try it out.</p>
              <p className='text-sm font-light mt-2'>
                <a href="https://console.weaviate.cloud/dashboard" target="_blank" rel="noopener noreferrer">
                  https://console.weaviate.cloud/dashboard
                </a>
              </p>
            </div>
          </details>

          <h1 className="text-base mt-5">Enter your credentials</h1>
          <label className="input input-bordered flex items-center gap-2 mt-2">
            <p className='text-xs'>Weaviate URL</p>
            <input type="password" className="grow" value={weaviateURL} onChange={(e) => { setWeaviateURL(e.target.value) }} />
          </label>
          <label className="input input-bordered flex items-center gap-2 mt-2">
            <p className='text-xs'>Weaviate Key</p>
            <input type="password" className="grow" value={weaviateKey} onChange={(e) => { setWeaviateKey(e.target.value) }} />
          </label>


          <div className='flex items-center justify-end gap-3 mt-2'>
            <p className="text-xs text-light">Remember credentials in browser</p>
            <input type="checkbox" className="checkbox checkbox-sm" checked={saveWeaviateCredentials} onChange={(e) => { setSaveWeaviateCredentials(e.target.checked) }} />
          </div>

          <div className=' flex gap-2 justify-end items-center mt-2'>
            <button type='button' onClick={handleConnectWeaviate} className="btn bg-green-400 hover:bg-green-300 mr-2">Connect</button>
            <button type='button' className="btn bg-pink-300 hover:bg-pink-200 mr-2">Clear</button>
          </div>

          <label className="form-control w-full mt-2">
            <div className="label">
              <span className="label-text">Select a collection</span>
            </div>
            <select disabled={weaviateStatus === "not connected"} className="select select-bordered" defaultValue={selectedCollection}>
              {collection.length > 0 && (<option>Create new</option>)}
              {collection.map((className, index) => (
                <option>{className}</option>
              ))}
            </select>
          </label>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

    </main>
  );
}
