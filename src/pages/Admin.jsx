import React, { useEffect, useState, useMemo } from "react";
import API from "../api";
import { logout } from "../auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Admin() {
  const [todos, setTodos] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchAllTodos = async () => {
    try {
      const res = await API.get("/todos/admin/all");
      setTodos(res.data);
    } catch (error) {
      toast.error("Failed to fetch admin data");
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const groupedTodos = useMemo(() => {
    let processed = [...todos];

    // Filter by Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      processed = processed.filter((todo) => {
        const name = todo.user?.name?.toLowerCase() || "";
        const email = todo.user?.email?.toLowerCase() || "";
        return name.includes(lowerQuery) || email.includes(lowerQuery);
      });
    }

    // Filter by Date
    if (filterDate) {
      processed = processed.filter((todo) => {
        const todoDate = new Date(todo.createdAt).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
        return todoDate === filterDate;
      });
    }

    // Sort by Date Descending (Latest first)
    processed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Group by User
    const groups = {};
    processed.forEach((todo) => {
      const userId = todo.user?._id || "unknown";
      if (!groups[userId]) {
        groups[userId] = {
          id: userId,
          user: todo.user || { name: "Unknown", email: "Unknown" },
          todos: [],
        };
      }
      groups[userId].todos.push(todo);
    });

    return Object.values(groups);
  }, [todos, filterDate, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDate, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = groupedTodos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(groupedTodos.length / itemsPerPage);

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <div className="app-bg min-h-screen p-6 text-white">
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Admin Dashboard
          </h1>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
            <input
              type="text"
              className="input-field py-2 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user..."
            />
            <input
              type="date"
              className="input-field py-2 max-w-xs"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by date"
            />
            {filterDate && (
              <button 
                onClick={() => setFilterDate("")}
                onClickCapture={() => setSearchQuery("")}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-900 rounded-lg transition-colors text-sm font-bold whitespace-nowrap"
              >
                Clear Filter
              </button>
            )}
        </div>

        {/* Data Table */}
        <div className="w-full bg-blue-900/90 rounded-xl border border-blue-700/50 shadow-lg">
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 text-gray-200">  
                  <th className="p-4 font-semibold w-16">Sl. No</th>
                  <th className="p-4 font-semibold">User Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold text-center">Tasks Count</th>
                  <th className="p-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {currentItems.map((group, index) => (
                  <React.Fragment key={group.id}>
                    <tr 
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${expandedUserId === group.id ? 'bg-white/5' : ''}`}
                      onClick={() => toggleExpand(group.id)}
                    >
                      <td className="p-4 text-gray-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-4 font-medium">{group.user.name}</td>
                      <td className="p-4 text-gray-400">{group.user.email}</td>
                      <td className="p-4 text-center">
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs font-bold border border-indigo-500/30">
                          {group.todos.length} Todos
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 inline-block transform transition-transform duration-300 ${expandedUserId === group.id ? 'rotate-180' : ''}`} 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </td>
                    </tr>
                    {expandedUserId === group.id && (
                      <tr className="bg-black/20">
                        <td colSpan="5" className="p-0">
                          <div className="p-4 sm:p-6 border-t border-gray-700/50">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                              Todo List ({group.todos.length})
                            </h3>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-gray-500 border-b border-gray-700/50">
                                    <th className="pb-2 text-left">Task Title</th>
                                    <th className="pb-2 text-left">Created At</th>
                                    <th className="pb-2 text-left">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                  {group.todos.map((todo) => (
                                    <tr key={todo._id} className="hover:bg-white/5 transition-colors">
                                      <td className="py-3 pr-4">{todo.title}</td>
                                      <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">{formatDate(todo.createdAt)}</td>
                                      <td className="py-3">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            todo.completed
                                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                          }`}
                                        >
                                          {todo.completed ? "Completed" : "Pending"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {groupedTodos.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      No users or todos found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-center items-center p-4 gap-4 border-t border-gray-700/50 bg-white/5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-300 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;