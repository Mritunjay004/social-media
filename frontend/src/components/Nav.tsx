import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";

const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Modal openType="create" open={modalOpen} setOpen={setModalOpen} />

      <nav className="bg-blue-500 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Mwitter
            </Link>
          </div>
          <div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4 mr-2 transition duration-300 ease-in-out"
            >
              Create Tweet
            </button>
            <Link to="/tweets" className="text-white hover:text-blue-200 px-4">
              My Tweets
            </Link>

            <Link to="/users" className="text-white hover:text-blue-200 px-4">
              Users
            </Link>

            {localStorage.getItem("token") && (
              <button
                className="text-white hover:text-blue-200 px-4"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
