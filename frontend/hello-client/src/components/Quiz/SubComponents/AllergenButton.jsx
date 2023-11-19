import React, {useEffect, useRef, useState} from 'react';
import { motion } from 'framer-motion';
import '@fortawesome/fontawesome-free/css/all.min.css';



const AllergenButton = ({ ingredient, iconClass, onClick, selected }) => {
    const userCode = useRef("");
    const btnColor = selected ? "btn-accent shadow-lg shadow-amber-800/30" : "btn-neutral shadow-lg";

    useEffect(() => {
        const cookie = localStorage.getItem("user-code");

        if (cookie == null) {
            //navigate("/login");
        } else {
            userCode.current = cookie;
            console.log("fetched user-secret: ", cookie);
        }
    })

    return (
        <motion.button className={`btn ${btnColor} w-fit`} onClick={onClick}
                       whileTap={{ scale: 1.2 }}
                          whileHover={{ scaleY: 1, scaleX: 1.2, transition: { duration: 0.05 } }}
        >
            <i className={`${iconClass}`}></i>
            {ingredient}
        </motion.button>
    );
};

export default AllergenButton;

