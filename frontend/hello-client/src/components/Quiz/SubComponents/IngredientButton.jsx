import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '@fortawesome/fontawesome-free/css/all.min.css';



const IngredientButton = ({ ingredient, iconClass, onClick, selected }) => {
    const btnColor = selected ? "btn-primary" : "btn-neutral";

    return (
        <button className={`btn ${btnColor} w-fit`} onClick={onClick}>
            <i className={iconClass}></i>
            {ingredient}
        </button>
    );
};

export default IngredientButton;

