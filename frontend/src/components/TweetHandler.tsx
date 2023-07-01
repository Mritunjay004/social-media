import { useForm } from "react-hook-form";
import { reloadPage } from "../utils";

const TweetForm = ({
  setOpen,
  type,
  id,
}: {
  setOpen: (open: boolean) => void;
  type: "create" | "edit";
  id?: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const tweet = data.tweet;
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const url =
      type === "create"
        ? `${baseUrl}/api/tweets/`
        : `${baseUrl}/api/tweets/${id}`;

    const res = await fetch(url, {
      method: type === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify({ tweet }),
    });

    const response = await res.json();

    if (response) {
      setOpen(false);

      reloadPage("/tweets");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="tweet"
          className="block text-sm font-medium text-gray-700"
        >
          Tweet
        </label>
        <textarea
          {...register("tweet", { required: true })}
          id="tweet"
          className="mt-1 block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        ></textarea>
        {errors.tweet && <p className="text-red-500">This field is required</p>}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4"
        >
          {type === "create" ? "Create" : "Done"}
        </button>
      </div>
    </form>
  );
};

export default TweetForm;
