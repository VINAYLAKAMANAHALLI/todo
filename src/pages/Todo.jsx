import React, { useEffect, useState, useRef, useMemo } from "react";
import API from "../api";
import gsap from "gsap";
 import { logout } from "../auth";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [name, setName] = useState(localStorage.getItem("name") || "User");
  const listRef = useRef(null);
  const containerRef = useRef(null);

 

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      await API.post("/todos", { title });
      setTitle("");
      fetchTodos();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const updateTodo = async (id, completed) => {
    try {
      await API.put(`/todos/${id}`, { completed });
      fetchTodos();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      fetchTodos();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
  logout();
  window.location.href = "/";
};

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const filteredTodos = useMemo(() => {
    const filtered = todos.filter((todo) => {
      if (!filterDate) return true;
      const todoDate = new Date(todo.createdAt).toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });
      return todoDate === filterDate;
    });
    return filtered.sort((a, b) => (a.completed === b.completed ? new Date(b.createdAt) - new Date(a.createdAt) : a.completed ? 1 : -1));
  }, [todos, filterDate]);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (todos.length > 0 && listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [filteredTodos]);

  return (
    <div className="app-bg flex flex-col items-center p-4 sm:p-10">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div ref={containerRef} className="w-full max-w-2xl relative z-10">
        

        <h2 className="text-5xl font-black mb-10 text-center text-slate-800 tracking-tight">
          Welcome {name}
        </h2>

        <div className="flex gap-3 mb-10">
          <input
            className="input-field flex-1"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button 
            onClick={addTodo}
            className="btn-action"
          >
            Add
          </button>
          <button
  onClick={handleLogout}
  className="btn-danger"
          >
            Logout
</button>
        </div>

        <div className="flex gap-3 mb-6 w-full">
          <input
            type="date"
            className="input-field flex-1"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="Filter by date"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all duration-300"
            >
              Clear
            </button>
          )}
        </div>

        <ul ref={listRef} className="space-y-4">
          {filteredTodos.map((todo) => (
            <li key={todo._id} className="todo-item">
              <div 
                className="flex items-center gap-4 flex-1 cursor-pointer" 
                onClick={() => updateTodo(todo._id, !todo.completed)}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${todo.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 group-hover:border-blue-500'}`}>
                  {todo.completed && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="flex flex-col">
                  <span className={`text-lg font-medium transition-all duration-300 ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {todo.title}
                  </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                    <span>Created: {formatDate(todo.createdAt)}</span>
                    <span>Updated: {formatDate(todo.updatedAt)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); deleteTodo(todo._id); }}
                className="p-2 text-slate-400 hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transform hover:scale-110"
                title="Delete Todo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todos;
