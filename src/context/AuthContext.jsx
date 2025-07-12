// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user has accounts - separate function
  const checkUserAccounts = async (token) => {
    try {
      const response = await fetch("https://financial-tracker-api-1wlt.onrender.com/api/accounts/", {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (response.ok) {
        const accounts = await response.json();
        return accounts.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error checking accounts:', error);
      return false;
    }
  };

  // Handle post-login account check and redirect
  const handlePostLoginRedirect = async (token) => {
    try {
      const hasAccounts = await checkUserAccounts(token);
      if (!hasAccounts) {
        navigate("/add-account", { replace: true });
      }
    } catch (error) {
      console.error('Error in post-login redirect:', error);
    }
  };

  useEffect(() => {
    if (authToken) {
      setLoading(true);
      fetch("https://financial-tracker-api-1wlt.onrender.com/api/user/", {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          // Check accounts after setting user data
          handlePostLoginRedirect(authToken);
        })
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
      const res = await fetch("https://financial-tracker-api-1wlt.onrender.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend response:", data);
        throw new Error(data.non_field_errors?.[0] || "Login failed");
      }

      localStorage.setItem("authToken", data.token);
      setAuthToken(data.token);

      const userRes = await fetch("https://financial-tracker-api-1wlt.onrender.com/api/user/", {
        headers: { Authorization: `Token ${data.token}` },
      });

      const userData = await userRes.json();
      setUser(userData);
      
      // Check accounts and redirect if needed
      await handlePostLoginRedirect(data.token);

      return true;
    } catch (err) {
      console.error("Login error:", err.message);
      return false;
    }
  };

  const googleLogin = async (token) => {
    try {
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setUser(null);
      
      const response = await fetch('https://financial-tracker-api-1wlt.onrender.com/api/auth/google/', {
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
        
        if (data.user) {
          setUser(data.user);
        }
        
        // Check accounts and redirect if needed for Google login too
        await handlePostLoginRedirect(data.token);
        
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
    <AuthContext.Provider value={{ 
      authToken, 
      user, 
      login, 
      googleLogin, 
      logout, 
      loading,
      checkUserAccounts // Export this in case you need it elsewhere
    }}>
      {children}
    </AuthContext.Provider>
  );
};