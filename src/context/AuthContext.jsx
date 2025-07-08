// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [authToken, setAuthToken] = useState(() =>
   localStorage.getItem("authToken")
 );
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   if (authToken) {
     setLoading(true);
     fetch("https://financial-tracker-api-iq2a.onrender.com/api/user/", {
       headers: {
         Authorization: `Token ${authToken}`,
       },
     })
       .then((res) => res.json())
       .then((data) => setUser(data))
       .catch((err) => {
         setUser(null);
         console.error("User fetch error:", err);
       })
       .finally(() => setLoading(false));
   } else {
     setUser(null);
     setLoading(false);
   }
 }, [authToken]);

 const login = async (username, password) => {
   try {
     localStorage.removeItem("authToken"); // Clear any previous token
     setAuthToken(null);
     setUser(null);
     const res = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/login/", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ username, password }),
     });

     if (!res.ok) throw new Error("Login failed");

     const data = await res.json();
     localStorage.setItem("authToken", data.token);
     setAuthToken(data.token);

     // fetch user after login
     const userRes = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/user/", {
       headers: {
         Authorization: `Token ${data.token}`,
       },
     });

     const userData = await userRes.json();
     setUser(userData);

     return true;
   } catch (err) {
     console.error("Login error:", err);
     return false;
   }
 };

 const googleLogin = async (token) => {
   try {
     localStorage.removeItem('authToken'); // Clear any previous token
     setAuthToken(null);
     setUser(null);
     const response = await fetch('https://financial-tracker-api-iq2a.onrender.com/api/auth/google/', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ token }),
     });
     
     const data = await response.json();
     if (data.success && data.token) {
       localStorage.setItem('authToken', data.token);
       setAuthToken(data.token);
       
       // Set user data from Google response
       if (data.user) {
         setUser(data.user);
       }
       
       return { 
         success: true, 
         user: data.user, 
         has_bank_account: data.has_bank_account 
       };
     }
     return { success: false };
   } catch (error) {
     console.error('Google login error:', error);
     return { success: false };
   }
 };

 const logout = () => {
   localStorage.removeItem("authToken");
   setAuthToken(null);
   setUser(null);
 };

 return (
   <AuthContext.Provider value={{ authToken, user, login, googleLogin, logout, loading }}>
     {children}
   </AuthContext.Provider>
 );
};