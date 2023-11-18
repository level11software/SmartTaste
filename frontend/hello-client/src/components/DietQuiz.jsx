import React, { useState } from 'react';
import DietPyramid from "./DietPyramid.jsx";

const DietPyramidPage = ({onContinue}) => {
    const [diet, setDiet] = useState(null);


    return (
        <div className="flex flex-col h-screen justify-between">
            <div className="p-4">
                <h1 className="text-2xl font-bold">What's your diet?</h1>
            </div>

            <DietPyramid onDietChange={setDiet} />

            <div className="p-4 text-right">
                <button
                    className="bg-primary text-white py-2 px-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
                    onClick={onContinue}
                >
                    <span>Continue</span>
                    <svg className="ml-2 w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DietPyramidPage;
