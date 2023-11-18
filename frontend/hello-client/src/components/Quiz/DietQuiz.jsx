import React, { useState } from 'react';
import DietPyramid from "./SubComponents/DietPyramid.jsx";

const DietPyramidPage = ({onContinue}) => {
    const [diet, setDiet] = useState(null);


    return (
        <div className="flex flex-col h-screen justify-between">
            <div className="p-4">
                <h1 className="text-2xl font-bold">What's your diet?</h1>
            </div>

            <DietPyramid onDietChange={setDiet} />

            <div className="p-4 justify-center">
                <button
                    className="bg-primary text-white py-2 px-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
                    onClick={onContinue}
                >
                    <span>Continue</span>
                    <i className="fa-solid fa-angles-right pl-5"></i>
                </button>
            </div>

        </div>
    );
};

export default DietPyramidPage;
