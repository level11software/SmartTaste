import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifiedGET } from "../consts";
import Recipe from "../components/Recipe.jsx";
import recipesData from '../assets/db_16.json';
import DietPyramid from "../components/DietPyramid.jsx";
import DietQuiz from "../components/DietQuiz.jsx";
import IngredientsQuiz from "../components/IngredientsQuiz.jsx";
import QuizContainer from "../components/QuizContainer.jsx";

function QuizPage() {
  const userCode = useRef(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = localStorage.getItem("user-code");

    if (cookie == null) {
      navigate("/login");
    } else {
      userCode.current = cookie;
      //console.log(cookie);
    }

    // getUser();
  }, []);

  return (
    <>
      {/*A list of recipes*/}
      <QuizContainer />
    </>
  );
}

export default QuizPage;
