import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '@fortawesome/fontawesome-free/css/all.min.css';



const AllergenButton = ({ ingredient, iconClass, onClick, selected }) => {
    const btnColor = selected ? "btn-accent shadow-lg shadow-amber-800/30" : "btn-neutral";

    return (
        <button className={`btn ${btnColor} w-fit`} onClick={onClick}>
            <i className={`${iconClass}`}></i>
            {ingredient}
        </button>
    );
};

export default AllergenButton;

