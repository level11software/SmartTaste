import React, { useState } from 'react';
import { motion } from "framer-motion";

const DietGlassCard = ({title, description, image_src: imageSrc, isSelected, onDietChange, selectedDiet}) => {
    // no state in the card, so no need to use useState
    const handleClick = (level) => {
        onDietChange(level);
        console.log("CARD: Diet level changed to:", level);
    };

    return (
        // Apply whileHover to the motion.div
        <motion.div
            className="card shadow-xl w-64"
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
            animate={{ opacity: selectedDiet === null || isSelected ? 1 : 0.6 }}// Conditional opacity
            onClick={() => handleClick(title)}
        >
            <figure><img className={"h-[170px] object-cover"} src={imageSrc} alt="car!"/></figure>
            <div className="card-body p-4">
                <h2 className="card-title">{title}</h2>
                <p className={"italic text-sm font-light"}>{description}</p>
{/*                <div className="card-actions justify-end">
                    <button
                        className="btn btn-primary py-1"
                        onClick={() => handleClick('someLevel')} // Added onClick handler
                    >
                        Select
                    </button>
                </div>*/}
            </div>
        </motion.div>
    );
};

export default DietGlassCard;
