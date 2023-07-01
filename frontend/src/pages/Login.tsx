import axios from "axios";
import { useForm } from "react-hook-form";
import Breadcrumbs from "../components/BreadCrumbs";

const Login = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/";
      }
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };

  const breadcrumbs = [{ label: "Home", to: "/" }, { label: "Login" }];

  return (
    <>
      <Breadcrumbs links={breadcrumbs} />
      <div className="flex justify-center items-center h-screen">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: true })}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
