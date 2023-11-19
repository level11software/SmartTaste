import React, {useEffect, useRef, useState} from 'react';
import DietGlassCard from "./SubComponents/DietGlassCard.jsx";
import {motion} from "framer-motion";
import {postToAPI} from "../../consts.jsx";

const DietPyramidPage = ({onContinue}) => {
    const userCode = useRef("");
    const [selectedDiet, setSelectedDiet] = useState(null);

    // get token
    useEffect(() => {
        const cookie = localStorage.getItem("user-code");

        if (cookie == null) {
            //navigate("/login");
        } else {
            userCode.current = cookie;
            console.log("fetched user-secret: ", cookie);
        }
    })

    const handleDietChange = (diet) => {
        console.log("Diet level changed to:", diet);
        setSelectedDiet(diet);

    };

    // Function to create a JSON object from the selectedDiet
    const createDietJSON = () => {
        const dietMapping = { "Vegan": "VEGAN", "Vegetarian": "VEGETARIAN", "Pescatarian": "PESCATARIAN", "Omnivore": "OMNIVORE" };
        const dietValue = dietMapping[selectedDiet]// || null; // Maps the diet to a corresponding number or null if not selected

        return JSON.stringify({ selected_diet: dietValue });
    };

    // Function to handle the continue action
    const handleContinue = async () => {
        const dietJSON = createDietJSON();
        // Perform your POST request here with dietJSON
        console.log("Sending diet JSON:", dietJSON);

        try {
            // Perform your POST request here with dietJSON
            const response = await postToAPI('set_diet', dietJSON, userCode.current);
            console.log("Response from the server:", response);

            // Call the onContinue prop if it's provided
            onContinue && onContinue();
        } catch (error) {
            console.error("Error in posting diet JSON:", error);
        }

        onContinue && onContinue(); // Call the onContinue prop if it's provided
    };



    return (

        <div className="flex h-screen justify-center items-center p-5">

            <div className="flex flex-col h-screen justify-between p-5 w-2/5">
                <div className="p-4 pt-4">
                    <h1 className="text-2xl font-bold">Select Your Diet Preference</h1>
                    <div className="divider divider-primary text-xs"> The one that aligns with your values</div>
                </div>

                <div className="grid grid-cols-2 grid-rows-2 gap-8 justify-items-center">
                    <DietGlassCard onDietChange={handleDietChange} title={"Vegan"}
                                   description={"Purely Plant-Powered. Rich in fruits, vegetables, legumes, and grain"}
                                   image_src={"https://cdn-prod.medicalnewstoday.com/content/images/articles/324/324343/plant-meal.jpg"}
                                   isSelected={selectedDiet === "Vegan"}
                                   selectedDiet={selectedDiet}/>

                    <DietGlassCard onDietChange={handleDietChange} title={"Vegetarian"}
                                   description={"Welcome eggs and dairy! Variety of plant-based foods and dairy."}
                                   image_src={"https://www.verywellfit.com/thmb/ZivTDxsx-dBBYR8_iTQmKjJ9JDo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vegetarian-diet-crop-f35bdf38c6c14ba3a189bc3900dd3384.jpg"}
                                   isSelected={selectedDiet === "Vegetarian"}
                                   selectedDiet={selectedDiet}/>

                    <DietGlassCard onDietChange={handleDietChange} title={"Pescatarian"}
                                   description={"Added enefits of fish, Don't give up your dose of omega-3 fatty acids!"}
                                   image_src={"https://static.wixstatic.com/media/2b1bc2_a869d0bd4f6345588ca333a83c5b3c61~mv2.jpg/v1/fill/w_640,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/2b1bc2_a869d0bd4f6345588ca333a83c5b3c61~mv2.jpg"}
                                   isSelected={selectedDiet === "Pescatarian"}
                                   selectedDiet={selectedDiet}/>

                    <DietGlassCard onDietChange={handleDietChange} title={"Omnivore"}
                                   description={"An all-inclusive, encompassing plant-based foods alongside meat and dairy."}
                                   //image_src={"https://www.worldanimalprotection.org.uk/sites/default/files/styles/600x400/public/media/1019368_0.jpg?itok=AzTD9_S_"}
                                   image_src={"https://thebarbell.com/wp-content/uploads/2023/02/vegan-vs.-omnivore.jpeg"}
                                   isSelected={selectedDiet === "Omnivore"}
                                   selectedDiet={selectedDiet}/>

                </div>

                <div className="p-4 flex justify-center">
                    <button
                        className={`bg-primary text-white py-2 px-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors ${selectedDiet ? '' : 'opacity-50 cursor-not-allowed'}`}
                        onClick={selectedDiet ? handleContinue : null}
                        disabled={!selectedDiet} // Disable the button if no diet is selected
                    >
                        <span>Continue</span>
                        <i className="fa-solid fa-angles-right pl-5"></i>
                    </button>
                </div>


            </div>

        </div>
    );
};

export default DietPyramidPage;
