import React, {useEffect, useState} from 'react';
import IngredientButton from "./IngredientButton.jsx";

// ... [rest of the imports]

const IngredientsQuiz = () => {
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
                    onClick={handleContinue}
                >
                    <span>Continue</span>
                    <i className="fa-solid fa-angles-right pl-5"></i>
                </button>
            </div>
        </div>
    );
};

export default IngredientsQuiz;

