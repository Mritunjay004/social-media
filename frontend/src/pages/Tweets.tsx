import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tweet } from "../models";
import { getHeaders } from "../utils";

const Tweets = () => {
  const [tweets, setTweets] = useState([]);

  function getTweets() {
    const headers = getHeaders();

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/tweets`, { headers })
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
    <div className="max-w-md mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">My Tweets</h1>
      <div className="space-y-4">
        {tweets?.map((tweet: Tweet) => (
          <div key={tweet._id}>
            <Link
              to={{
                pathname: `/tweets/${tweet._id}`,
                search: `?id=${tweet._id}&content=${tweet.content}&timestamp=${tweet.timestamp}
                `,
              }}
              className="block"
            >
              <div className="border rounded-md p-4">
                <div className="mt-2 text-sm text-gray-700">
                  <p>{tweet.content}</p>
                </div>
                <div className="flex items-center">
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime="2020-03-16">{tweet.timestamp}</time>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tweets;
