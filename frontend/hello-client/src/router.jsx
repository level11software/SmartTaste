import * as ReactDOM from "react-dom";
import { Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import QuizPage from "./pages/QuizPage.jsx";
import AniSium from "./pages/AniSium";

export const pages = [
  {
    path: "/",
    name: "home",
    element: <HomePage />,
    displayNav: false,
    id: 0,
  },
  {
    path: "/login",
    name: "login",
    element: <LoginPage />,
    displayNav: false,
    id: 1,
  },
  {
    path: "/quiz",
    name: "quiz",
    element: <QuizPage />,
    displayNav: false,
    id: 2,
  },
  {
    path: "/ani",
    name: "ani",
    element: <AniSium />,
    id: 3,
  },
];

export const routeList = pages.map((page) => (
  <Route path={page.path} key={page.id} element={page.element} />
));

// export const linkList = pages
//   .filter((page) => page.displayNav)
//   .map((page) => (
//     <Link
//       to={page.path}
//       className="btn btn-ghost normal-case text-xl"
//       onClick={() => window.scrollTo(0, 0)}
//       key={page.id}
//     >
//       {page.name}
//     </Link>
//   ));
