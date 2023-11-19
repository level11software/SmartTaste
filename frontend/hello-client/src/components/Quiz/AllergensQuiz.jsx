import React, {useEffect, useRef, useState} from 'react';
import AllergenButton from "./SubComponents/AllergenButton.jsx";
import {postToAPI} from "../../consts.jsx";


// ... [rest of the imports]

const AllergensQuiz = ({onContinue}) => {
    const userCode = useRef("");
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    useEffect(() => {

        const cookie = localStorage.getItem("user-code");

        if (cookie == null) {
            //navigate("/login");
        } else {
            userCode.current = cookie;
            console.log("fetched user-secret: ", cookie);
        }

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

    const handleContinue = async () => {
        // Handle the continue action here
        console.log('Continue with these ingredients:', selectedIngredients);

        let json = JSON.stringify(selectedIngredients)
        // Perform your POST request here with dietJSON
        console.log("Sending diet JSON:", );

        try {
            // Perform your POST request here with dietJSON
            const response = await postToAPI('set_allergens', json, userCode.current);
            console.log("Response from the server:", response);

            // Call the onContinue prop if it's provided
            onContinue && onContinue();
        } catch (error) {
            console.error("Error in posting diet JSON:", error);
        }

        onContinue && onContinue(); // Call the onContinue prop if it's provided
    };




    // Updated ingredients with allergens
    const ingredients = [
        {name: "Tree nuts", icon: "fa-solid fa-bowl-rice"}, // Example icon
        {name: "Lactose", icon: "fa-solid fa-glass-water"}, // Example icon
        {name: "Soy", icon: "fa-solid fa-seedling"}, // Example icon
        {name: "Gluten", icon: "fa-solid fa-bread-slice"}, // Example icon
        {name: "Eggs", icon: "fa-solid fa-egg"}, // Example icon
        //{name: "Fish", icon: "fa-brands fa-forumbee"}, // Example icon
        {name: "Shellfish", icon: "fa-solid fa-shrimp"}, // Example icon
        // ... [add other ingredients here]
    ];

    return (
        <div className="flex h-screen justify-center items-center p-5 ">
            <div className="flex flex-col h-screen justify-between p-5 w-2/5">
                <div className="p-4 pt-4">
                    <h1 className="text-2xl font-bold">
                        What you're <span className="text-accent">NOT</span> gonna eat
                    </h1>
                    <div className="divider divider-accent text-xs"> We don't wanna kill you somehow..</div>
                </div>

                <div className="p-4 flex justify-center">
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

                <div className="p-4 flex justify-center">
                    <button
                        className="bg-primary text-white py-2 px-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
                        onClick={handleContinue}>
                        <span>Continue</span>
                        <i className="fa-solid fa-angles-right pl-5"></i>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AllergensQuiz;
