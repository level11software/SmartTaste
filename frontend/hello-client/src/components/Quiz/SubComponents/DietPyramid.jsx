import React, { useState } from 'react';

const DietPyramid = () => {
    const [selectedDiet, setSelectedDiet] = useState(null);

    const diets = [
        { level: 'Vegan', size: 'w-2/6 sm:w-3/4 md:w-2/3 lg:w-1/2' },
        { level: 'Vegetarian', size: 'w-3/6 sm:w-3/4 md:w-2/3 lg:w-1/2' },
        { level: 'Pescatarian', size: 'w-4/6 sm:w-3/4 md:w-2/3 lg:w-1/2' },
        { level: 'Omnivore', size: 'w-5/6 sm:w-3/4 md:w-2/3 lg:w-1/2' }
    ];

    const handleClick = (level) => {
        setSelectedDiet(level);
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 font-semibold">
            {diets.map((diet, index) => (
                <button
                    key={diet.level}
                    className={`pyramid-button shadow-xs rounded-md pd-4 h-20 my-2 ${diet.size} ${selectedDiet === diet.level ?
                        'shadow-2xl bg-primary scale-105' :
                        'bg-primary/50'} transition-all duration-300 ease-in-out`}
                    onClick={() => handleClick(diet.level)}
                >
                    {diet.level}
                </button>
            ))}
        </div>
    );
};

export default DietPyramid;
