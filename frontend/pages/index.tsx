import { FormEvent, useRef } from "react";
// interface formEvent extends FormEvent{
//   target: HTMLFormElement
// }
export default function Home() {
  function handleSubmit(e: FormEvent) {
    const formElement: HTMLFormElement = document.querySelector("form")!;
    e.preventDefault();
    interface ReqBody {
      url?: string;
      tags?: Array<string>;
    }
    const formData = new FormData(formElement);
    let reqBody: ReqBody = {
      url: formData.get("url")?.toString(),
      tags: formData.get("tags")?.toString().split(","),
    };
    // console.log(reqBody);
    fetch("/api/fetch", { method: "POST", body: JSON.stringify(reqBody) })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }
  return (
    <main>
      <form
        id="paramForm"
        autoComplete="off"
        className="max-w-sm rounded overflow-hidden shadow-lg mx-auto mt-4 flex-col flex items-start px-8 pt-6 pb-8"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          autoComplete="off"
          type="text"
          name="url"
          id="url"
          placeholder="Enter the Url:"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-4"
        />
        <input
          autoComplete="off"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-4"
          type="text"
          name="tags"
          id="tags"
          placeholder="Enter the tags: "
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
