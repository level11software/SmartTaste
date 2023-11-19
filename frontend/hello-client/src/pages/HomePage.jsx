import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifiedGET,
  registerAction,
  DISCARDED_RECIPE,
  BOUGHT_RECIPE,
  OPENED_RECIPE,
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
    registerAction(userCode.current, DISCARDED_RECIPE, id);

    setRecipesData(
      recipesData.filter((item) => {
        return item.id != id;
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
    //registerAction(userCode.current, )
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
    setRecipesData(home);
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
    <div>
      {/*A list of recipes*/}
      <div className="">
        {recipesData.map((item) => (
          <Recipe
            key={item.id}
            recipe={item}
            removal={removeCard}
            openDetail={commitOpened}
            savedAction={commitSave}
          />
        ))}
      </div>
      <div className="m-3 flex justify-center">
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
          {recipesData.map((item) => (
            <p className="py-4">{item.name}</p>
          ))}

          <div className="modal-action ">
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
  );
}

export default HomePage;
