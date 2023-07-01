import axios from "axios";
import { useEffect, useState } from "react";

import { useJwt } from "react-jwt";
import { getHeaders } from "../utils";

interface User {
  _id: string;
  username: string;
  following: string[];
  __v: number;
}

type DecodedToken = {
  userId: string;
  username: string;
  iat: number;
  exp: number;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>();
  const [loggedInUser, setLoggedInUser] = useState<User>();

  const { decodedToken }: { decodedToken: DecodedToken | null } = useJwt(
    localStorage.getItem("token") || ""
  );

  const handleFollow = (userId: string) => {
    const headers = getHeaders();

    const requestOptions = {
      method: "POST",
      headers: headers,
      redirect: "follow",
    };

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/users/${userId}/follow`,
        null,
        requestOptions
      )
      .then((response) => {
        const updatedUsers = users?.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              following: [...user.following, decodedToken?.userId],
            };
          } else {
            return user;
          }
        });

        setUsers(updatedUsers as User[]);

        const updatedLoggedInUser = {
          ...loggedInUser,
          following: [...(loggedInUser?.following as string[]), userId],
        };

        setLoggedInUser(updatedLoggedInUser as User);
      })
      .catch((error) => {
        alert("You are already following this user");
      });
  };

  const handleUnfollow = (userId: string) => {
    const headers = getHeaders();

    const requestOptions = {
      method: "POST",
      headers: headers,
      redirect: "follow",
    };

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/users/${userId}/unfollow`,
        null,
        requestOptions
      )
      .then((response) => {
        const updatedUsers = users?.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              following: user.following.filter(
                (followingId) => followingId !== decodedToken?.userId
              ),
            };
          } else {
            return user;
          }
        });

        setUsers(updatedUsers);

        const updatedLoggedInUser = {
          ...loggedInUser,
          following: loggedInUser?.following.filter(
            (followingId) => followingId !== userId
          ),
        };

        setLoggedInUser(updatedLoggedInUser as User);
      })
      .catch((error) => {
        alert("You are not following this user");
      });
  };

  function getUsers() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/users`, requestOptions)
      .then((response) => {
        setUsers(response.data.users);

        const user = response.data.users.find(
          (user: User) => user._id === decodedToken?.userId
        );

        setLoggedInUser(user);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }

  useEffect(() => {
    getUsers();
  }, [decodedToken?.userId]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul>
        {users
          ?.filter((user) => user._id !== loggedInUser?._id)
          .map((user) => {
            return (
              <li key={user._id} className="bg-white p-4 rounded shadow mb-4">
                <p className="text-gray-800">{user.username}</p>

                {loggedInUser?.following.includes(user._id) ? (
                  <button
                    onClick={() => handleUnfollow(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded py-2 px-4 mr-2 transition duration-300 ease-in-out"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(user._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4 mr-2 transition duration-300 ease-in-out"
                  >
                    Follow
                  </button>
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Users;
