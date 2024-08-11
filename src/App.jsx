import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Class from "./pages/class/Class";
import Classes from "./pages/classes/Classes";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import "./App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParentClasses from "./pages/parentClasses/ParentClasses";
import TutorClasses from "./pages/tutorClasses/TutorClasses";
import TutorRegister from "./pages/register/TutorRegister";
import ParentRegister from "./pages/register/ParentRegister";
import Tutor from "./pages/tutor/Tutor";
import Review from "./pages/review/Review";
function App() {
  const Layout = () => {
    return (
      <div className="app">
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Outlet />
        <Footer />
      </div>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/classes",
          element: <Classes />,
        },
        {
          path: "parent/classes",
          element: <ParentClasses />,
        },
        {
          path: "/classes/:id",
          element: <Class />,
        },
        {
          path: "/tutor/:id",
          element: <Tutor />,
        },
        {
          path: "tutor/classes",
          element: <TutorClasses />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/tutor/register",
          element: <TutorRegister />,
        },
        {
          path: "/parent/register",
          element: <ParentRegister />,
        },
        {
          path: "/review/:id",
          element: <Review />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
export default App;
