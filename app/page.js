"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, settodos] = useState({ title: " ", description: " " });
  const [currentTodos, setCurrentTodos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      let res = await fetch("/api");
      let data = await res.json();
      console.log(data.rows);
      setCurrentTodos(data.rows);
    };
    getData();
  }, []);

  const handleChange = (e) => {
    settodos({ ...todos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log(todos);

    let res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todos),
    });

    let response = await res.json();
    console.log(response);

    settodos({ title: " ", description: " " });
  };

  const getHelp = async (todo) => {
    let res = await fetch("/api/openai", {
      body: JSON.stringify({ todo: todo }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let response = await res.json();
    console.log(response);
  };
  return (
    <div>
      {" "}
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">Todo List</span>
          </a>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <a className="mr-5 hover:text-gray-900">Home</a>
            <a className="mr-5 hover:text-gray-900">About Us</a>
          </nav>
        </div>
      </header>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Add a Todo
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Helps you to Add a Todo
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="title"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Todo Name
                  </label>
                  <input
                    type="title"
                    id="title"
                    name="title"
                    value={todos.title}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="description"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={todos.description}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  onClick={handleSubmit}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  Add Todo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container px-5 py-12 mx-auto">
        <section>
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Your Todo List
          </h1>
          {currentTodos.map((item) => {
            return (
              <div>
                <table className="table-fixed border-collapse border border-slate-500 w-full bg-yellow-500">
                  <thead>
                    <tr>
                      <th className="border border-slate-600">Title</th>
                      <th className="border border-slate-600">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-700">{item[0]}</td>
                      <td className="border border-slate-700">{item[1]}</td>
                    </tr>
                  </tbody>
                </table>
                <button onClick={()=>getHelp([item[0]])} className="flex flex-end mx-auto text-white bg-indigo-500 hover:bg-indigo-600 py-2 rounded">Get AI Help</button>
              </div>
            );
          })}
        </section>
      </div>
      <div className="container px-5 py-12 mx-auto">
        <section>
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Help From OpenAI
          </h1>
          <p>This is Task related help...</p>
        </section>
      </div>
    </div>
  );
}
