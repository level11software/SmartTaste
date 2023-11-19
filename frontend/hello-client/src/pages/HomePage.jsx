import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifiedGET,
  registerAction,
  DISCARDED_RECIPE,
  BOUGHT_RECIPE,
  OPENED_RECIPE,
  SAVED_RECIPE,
  verifiedPOST,
} from "../consts";
import Recipe from "../components/Recipe.jsx";
import "./animation.css";
//import recipesData from "../assets/db_16.json";

function HomePage() {
  const userCode = useRef(-1);
  const navigate = useNavigate();
  const [recipesData, setRecipesData] = useState([]);

  async function removeCard(id) {
    //request post the removed card
    await registerAction(userCode.current, DISCARDED_RECIPE, id);

    setRecipesData(
      recipesData.map((item, index) => {
        if (item.id == id) {
          item.noRender = true;
          getRecommendation(index);
          return item;
        }
        return item;
      })
    );
  }

  async function commitOrder() {
    const keys = recipesData.map((item) => {
      return item.id;
    });

    keys.map((id) => registerAction(userCode.current, BOUGHT_RECIPE, id));
  }

  async function commitSave(id) {
    await registerAction(userCode.current, SAVED_RECIPE, id);

    setRecipesData(
      recipesData.map((item, index) => {
        if (item.id == id) {
          item.noRender = true;
          getRecommendation(index);
          return item;
        }
        return item;
      })
    );
  }

  async function commitOpened(id) {
    registerAction(userCode.current, OPENED_RECIPE, id);
  }

  async function getUser() {
    const user = await verifiedGET("hello", userCode.current);
    console.log(user);
  }

  async function getHomePage() {
    const home = await verifiedGET("homepage", userCode.current);
    localStorage.setItem(
      "received-recipes",
      home.map((rec) => rec.id)
    );
    console.log(home);
    setRecipesData(home);
  }

  async function getRecommendation(index) {
    const payload = {
      recipes_to_exclude: recipesData.map((item) => item.id),
      //.filter((item, i) => i != index),
    }; //localStorage.getItem("received-recipes");
    const newrecc = await verifiedPOST(
      "get_new_recommendation",
      userCode.current,
      payload
    );

    if (newrecc.length == 0) {
      setRecipesData(
        recipesData.filter((_, i) => {
          return i != index;
        })
      );
    }

    console.log(newrecc[0]);
    setRecipesData(
      recipesData.map((item, i) => {
        if (i == index) {
          return newrecc[0];
        }
        return item;
      })
    );
  }

  useEffect(() => {
    const cookie = localStorage.getItem("user-code");

    if (cookie == null || cookie == undefined) {
      navigate("/login");
    } else {
      userCode.current = cookie;
      //console.log(cookie);
    }
    // getUser();
    getHomePage();
  }, []);

  return (
    <div className="flex h-screen flex-col justify-center items-center p-5">
      <div className="max-w-xl w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold">Which recipes?</h1>
        <div className="divider divider-primary text-xs w-full">
          What are you eating this week?
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-4">
        {/*A list of recipes*/}
        <div className="grid grid-cols-2 grid-rows-2  gap-8">
          {recipesData.map((item) => (
            <Recipe
              key={item.id}
              recipe={item}
              removal={removeCard}
              openDetail={commitOpened}
              saveAction={commitSave}
            />
          ))}
        </div>

        <div className="m-4 flex justify-center">
          <button
            className="btn btn-primary"
            onClick={() => {
              document.getElementById("modal_commit_buy").showModal();
            }}
          >
            ORDER
          </button>
        </div>

        <dialog id="modal_commit_buy" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Purchase Summary</h3>
            <ul className="ml-5 list-disc">
              {recipesData.map((item) => (
                <li className="py-4">{item.name}</li>
              ))}
            </ul>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn mx-5">Close</button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    commitOrder();
                  }}
                >
                  Confirm
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}

export default HomePage;
