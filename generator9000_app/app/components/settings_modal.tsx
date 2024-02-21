import React from 'react';


interface SettingsModalComponentProps {
    generationPodNumber: number;
    imageSize: string;
    imageStyle: string;
    textTemperature: number;
    setGenerationPodNumber: (_number: number) => void;
    setImageSize: (_size: string) => void;
    setImageStyle: (_size: string) => void;
    setTextTemperature: (_size: number) => void;

}

const SettingsModalComponent: React.FC<SettingsModalComponentProps> = ({ generationPodNumber, imageSize, imageStyle, textTemperature, setGenerationPodNumber, setImageSize, setImageStyle, setTextTemperature }) => {


    return (
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
    );
};

export default SettingsModalComponent;
