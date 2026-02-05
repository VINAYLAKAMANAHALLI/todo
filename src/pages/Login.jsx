import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { loginUser, registerUser } from "../auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { toast } from "react-toastify";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(location.pathname === "/register");
  const [isLoading, setIsLoading] = useState(false);
  
  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regEmailError, setRegEmailError] = useState("");

  const cardRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
  }, [location.pathname]);

  useLayoutEffect(() => {
    // If we navigated back to login from register, start at -180 so we can flip back to 0
    if (!isRegister && location.state?.fromRegister) {
      gsap.set(cardRef.current, { rotationY: -180 });
    }
  }, [location.state, isRegister]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (isRegister) {
      gsap.to(cardRef.current, { rotationY: -180, duration: 0.8, ease: "power2.inOut" });
    } else {
      gsap.to(cardRef.current, { rotationY: 0, duration: 0.8, ease: "power2.inOut" });
    }
  }, [isRegister]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.warn("Please fill all fields");
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });
      toast.success("Login successful");
      
      if (data.role === "admin") {
        setTimeout(() => navigate("/admin"), 800);
      } else {
        setTimeout(() => navigate("/todos"), 800);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegEmailError("");
    if (!regName || !regEmail || !regPassword) return toast.warn("Please fill all fields.");
    if (!validateEmail(regEmail)) {
      setRegEmailError("Please enter a valid email address.");
      return toast.error("Invalid email format.");
    }
    setIsLoading(true);
    try {
      await registerUser({ name: regName, email: regEmail, password: regPassword });
      toast.success("Registration successful! Please login.");
      setIsLoading(false);
      navigate("/", { state: { fromRegister: true } });
    } catch (err) {
      toast.error("Registration failed. The email might already be in use.");
      setIsLoading(false);
    }
  };

  const toggleMode = (mode) => {
    if (mode) navigate("/register");
    else navigate("/", { state: { fromRegister: true } });
  };

  return (
    <div className="app-bg min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div ref={containerRef} className="flex flex-col lg:flex-row w-full max-w-5xl items-center gap-8 lg:gap-10 z-10">

        {/* Left Side: Content (Swapped) */}
        <div className="w-full lg:w-1/2 text-white space-y-6 lg:space-y-8 text-center lg:text-left">
           <img 
             src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3" 
             alt="Todo Illustration" 
             className="w-3/5 lg:w-4/5 mx-auto lg:mx-0 drop-shadow-2xl rounded-2xl opacity-90" 
           />
           <div>
             <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
               Organize Your Life
             </h1>
             <p className="text-base lg:text-lg text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0">
               Stay on top of your tasks with our intuitive Todo App. 
               Manage your day, track your progress, and achieve your goals effortlessly.
             </p>
           </div>
        </div>
        
        {/* Right Side: Card with Flip (Swapped) */}
        <div className="w-full max-w-md lg:max-w-none lg:w-1/2 h-[500px] sm:h-[550px] [perspective:1000px]">
          <div ref={cardRef} className="relative w-full h-full [transform-style:preserve-3d]">
            
            {/* Front Face: Login */}
            <div className={`absolute inset-0 [backface-visibility:hidden] ${isRegister ? "pointer-events-none" : "pointer-events-auto"}`}>
              <div className="glass-card h-full flex flex-col justify-center p-8">
                <h2 className="heading-text mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <input
                      className="input-field"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                    />
                    <div className="relative">
                      <input
                        className="input-field"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.477 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>
                  <div className="text-center mt-4">
                    <button type="button" onClick={() => toggleMode(true)} className="link-text">
                      Don’t have an account? Register
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Back Face: Register */}
            <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${isRegister ? "pointer-events-auto" : "pointer-events-none"}`}>
              <div className="glass-card h-full flex flex-col justify-center p-8">
                <h2 className="heading-text mb-6">Create Account</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-4">
                    <input
                      className="input-field"
                      placeholder="Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      type="text"
                      required
                    />
                    <input
                      className="input-field"
                      placeholder="Email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      type="email"
                      required
                    />
                    {regEmailError && <p className="text-red-500 text-xs mt-1 px-1">{regEmailError}</p>}
                    <div className="relative">
                      <input
                        className="input-field"
                        placeholder="Password"
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      >
                        {showRegPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.477 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : (
                      "Register"
                    )}
                  </button>
                  <div className="text-center mt-4">
                    <button type="button" onClick={() => toggleMode(false)} className="link-text">
                      Already have an account? Login
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
