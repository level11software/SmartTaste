import React, { useState } from "react";
import DietGlassCard from "./SubComponents/DietGlassCard.jsx";
import { motion } from "framer-motion";

const DietPyramidPage = ({ onContinue }) => {
  const [selectedDiet, setSelectedDiet] = useState(null);

  const handleDietChange = (diet) => {
    console.log("Diet level changed to:", diet);
    setSelectedDiet(diet);
  };

  return (
    <div className="flex h-screen justify-center items-center p-5">
      <div className="flex flex-col h-screen justify-between p-5">
        <div className="p-4">
          <h1 className="text-2xl font-bold">What's your diet?</h1>
          <div className="divider divider-primary text-xs">
            {" "}
            Pick one below.
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-8 ">
          <DietGlassCard
            onDietChange={handleDietChange}
            title={"Vegan"}
            description={"bravo vegano."}
            image_src={
              "https://cdn-prod.medicalnewstoday.com/content/images/articles/324/324343/plant-meal.jpg"
            }
            isSelected={selectedDiet === "Vegan"}
            selectedDiet={selectedDiet}
          />

          <DietGlassCard
            onDietChange={handleDietChange}
            title={"Vegetarian"}
            description={"one that does not include any meat or seafood."}
            image_src={
              "https://www.verywellfit.com/thmb/ZivTDxsx-dBBYR8_iTQmKjJ9JDo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vegetarian-diet-crop-f35bdf38c6c14ba3a189bc3900dd3384.jpg"
            }
            isSelected={selectedDiet === "Vegetarian"}
            selectedDiet={selectedDiet}
          />

          <DietGlassCard
            onDietChange={handleDietChange}
            title={"Pescatarian"}
            description={"don't give up your dose of Omega 3 fatty acids!"}
            image_src={
              "https://static.wixstatic.com/media/2b1bc2_a869d0bd4f6345588ca333a83c5b3c61~mv2.jpg/v1/fill/w_640,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/2b1bc2_a869d0bd4f6345588ca333a83c5b3c61~mv2.jpg"
            }
            isSelected={selectedDiet === "Pescatarian"}
            selectedDiet={selectedDiet}
          />

          <DietGlassCard
            onDietChange={handleDietChange}
            title={"Omnivore"}
            description={"as nature made you."}
            image_src={
              "https://www.worldanimalprotection.org.uk/sites/default/files/styles/600x400/public/media/1019368_0.jpg?itok=AzTD9_S_"
            }
            isSelected={selectedDiet === "Omnivore"}
            selectedDiet={selectedDiet}
          />
        </div>

        <div className="p-4 justify-center">
          <button
            className={`bg-primary text-white py-2 px-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors ${
              selectedDiet ? "" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={selectedDiet ? onContinue : null}
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
