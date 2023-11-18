import React, {useEffect, useState} from 'react';
import AllergenButton from "./SubComponents/AllergenButton.jsx";

// ... [rest of the imports]

const AllergensQuiz = ({onContinue}) => {
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

    // Updated ingredients with allergens
    const ingredients = [
        {name: "Peanuts", icon: "fa-solid fa-bowl-rice"}, // Example icon
        {name: "Lactose", icon: "fa-solid fa-glass-water"}, // Example icon
        {name: "Honey", icon: "fa-brands fa-forumbee"}, // Example icon
        {name: "Gluten", icon: "fa-solid fa-bread-slice"}, // Example icon
        // ... [add other ingredients here]
    ];

    return (
        <div className="flex flex-col h-screen justify-between">
            <div className="p-4 pt-4">
                <h1 className="text-2xl font-bold">
                    What you're <span className="text-accent">NOT</span> gonna eat
                </h1>

                <h5> We don't wanna kill you somehow.. </h5>
            </div>

            <div className={"flex justify-center"}>
                <div className="grid justify-items-center grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-10 p-4">
                    {ingredients.map(ingredient => (
                        <AllergenButton
                            key={ingredient.name}
                            ingredient={ingredient.name}
                            iconClass={ingredient.icon}
                            onClick={() => handleIngredientClick(ingredient.name)}
                            selected={selectedIngredients.includes(ingredient.name)}
                        />
                    ))}
                </div>
            </div>

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

export default AllergensQuiz;
