import React, {useEffect, useState} from 'react';
import IngredientButton from "./SubComponents/IngredientButton.jsx";

// ... [rest of the imports]

const IngredientsQuiz = ({ onContinue }) => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    useEffect(() => {
        console.log('Selected Ingredients:', selectedIngredients);
    }, [selectedIngredients]);

    const handleIngredientClick = ingredient => {
        setSelectedIngredients(prevIngredients => {
            if (prevIngredients.includes(ingredient)) {
                return prevIngredients.filter(item => item !== ingredient);
            } else {
                return [...prevIngredients, ingredient];
            }
        });
    };

    const handleContinue = () => {
        // Handle the continue action here
        console.log('Continue with these ingredients:', selectedIngredients);
    };

    const ingredients = [
        { name: "Chicken", icon: "fa-solid fa-drumstick-bite" },
        { name: "Fish", icon: "fa-solid fa-fish" },
        { name: "Blueberries", icon: "fa-brands fa-blackberry" },
        // ... [add other ingredients here]
    ];

    return (
        <div className="flex flex-col h-screen justify-between">
            <div className="p-4 p-t-4">
                <h1 className="text-2xl font-bold">Pick some ingredients</h1>
            </div>

            {ingredients.map(ingredient => (
                <IngredientButton
                    key={ingredient.name}
                    ingredient={ingredient.name}
                    iconClass={ingredient.icon}
                    onClick={() => handleIngredientClick(ingredient.name)}
                    selected={selectedIngredients.includes(ingredient.name)}
                />
            ))}

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

export default IngredientsQuiz;

