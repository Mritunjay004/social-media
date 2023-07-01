import { useState } from "react";
import Modal from "../components/Modal";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getHeaders, reloadPage } from "../utils";

const TweetPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tweet = {
    _id: searchParams.get("id"),
    content: searchParams.get("content"),
    timestamp: searchParams.get("timestamp") as string,
  };

  const handleDelete = (id: string) => {
    const headers = getHeaders();

    const requestOptions = {
      method: "DELETE",
      headers: headers,
      data: "",
      redirect: "follow",
    };

    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/tweets/${id}`,
        requestOptions
      )
      .then((response) => {
        reloadPage("/tweets");
      })
      .catch((error) => {
        alert("Error deleting tweet");
      });
  };

  return (
    <>
      <Modal
        id={tweet._id as string}
        openType="edit"
        open={modalOpen}
        setOpen={setModalOpen}
      />

      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Tweet</h2>
            <div className="space-x-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setModalOpen(true)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(tweet._id as string)}
              >
                Delete
              </button>
            </div>
          </div>
          <p className="text-gray-800 mb-4">{tweet.content}</p>
          <p className="text-gray-500 text-sm">
            {new Date(tweet.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
};

export default TweetPage;
