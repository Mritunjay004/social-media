import { useEffect, useState } from "react";
import { Tweet } from "../models";
import axios from "axios";
import { getHeaders } from "../utils";

function Dashboard() {
  const token = localStorage.getItem("token");
  const [tweets, setTweets] = useState<Tweet[]>();

  useEffect(() => {
    if (!token) {
      window.location.href = "/register";
    }
  }, [token]);

  function getTweets() {
    const headers = getHeaders();

    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/tweets/timeline`,
        requestOptions
      )
      .then((response) => {
        setTweets(response.data);
      })
      .catch((error) => {
        alert("Error fetching tweets");
      });
  }

  useEffect(() => {
    getTweets();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">My Timeline</h1>
      <div className="max-w-md mx-auto mt-4">
        {tweets?.map((tweet) => (
          <div
            key={tweet._id}
            className="border border-gray-300 rounded p-4 mb-4"
          >
            <div className="flex items-center mb-2">
              <div>
                <p className="font-bold">{tweet.author}</p>
                <p className="text-xs text-gray-600">
                  {new Date(tweet.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <p>{tweet.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
