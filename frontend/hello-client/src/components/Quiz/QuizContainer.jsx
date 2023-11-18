import React, {useEffect, useState} from 'react';
import {Transition} from 'react-transition-group';
import DietQuiz from './DietQuiz.jsx';
import IngredientsQuiz from './IngredientsQuiz.jsx';
// ... import other quiz components

import CarouselQuiz from "./CarouselQuiz.jsx";
import {useNavigate} from "react-router-dom";

const QuizContainer = () => {

    const navigate = useNavigate();

    const [currentQuiz, setCurrentQuiz] = useState(1);
    const [inProp, setInProp] = useState(true);

    useEffect(() => {
        setInProp(true); // Set the new component to enter (visible)
    }, [currentQuiz]);

    const handleContinue = () => {
        setInProp(false); // Start the exit transition
        setTimeout(() => {
            setCurrentQuiz(currentQuiz + 1); // Update the quiz after the transition
        }, 300); // Match the duration of your CSS transition
    };

    const renderQuizComponent = () => {
        switch (currentQuiz) {
            case 1:
                return <CarouselQuiz onContinue={handleContinue}/>;
            case 2:
                return <DietQuiz onContinue={handleContinue}/>;
            case 3:
                return <IngredientsQuiz onContinue={handleContinue}/>;
            // ... cases for other quiz components
            default:
                return navigate("/")
        }
    };

    const defaultStyle = {
        transition: `opacity 300ms ease-in-out`,
        opacity: 0,
    };

    const transitionStyles = {
        entering: {opacity: 1},
        entered: {opacity: 1},
        exiting: {opacity: 0},
        exited: {opacity: 0},
    };

    return (

        <div>
            <div className="quiz-container">
                <Transition in={inProp} timeout={300}>
                    {state => (
                        <div style={{
                            ...defaultStyle,
                            ...transitionStyles[state]
                        }}>
                            {renderQuizComponent()}
                        </div>
                    )}
                </Transition>


            </div>


        </div>


    );
};

export default QuizContainer;
