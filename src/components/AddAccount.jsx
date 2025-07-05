import React, { useState } from "react";

export default function AddAccount() {
 const [form, setForm] = useState({
   bank_name: "",
   account_number: "",
   balance: ""
 });
 
 const [loading, setLoading] = useState(false);
 const [alert, setAlert] = useState({ message: "", type: "info" });

 const handleChange = (e) => {
   setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleSubmit = (e) => {
   e.preventDefault();
   setLoading(true);
   
   // Simulate API call
   setTimeout(() => {
     setAlert({ message: "Account added successfully!", type: "success" });
     setLoading(false);
   }, 1000);
 };

 const handleBackToLogin = () => {
   console.log('Navigate to login');
 };

 // Loading state
 if (loading) {
   return (
     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
       <div className="flex flex-col items-center space-y-4">
         <div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
         <div className="text-lg font-medium text-gray-600">Processing...</div>
       </div>
     </div>
   );
 }

 return (
   <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-gray-100">
     <div className="w-full max-w-md">
       {/* Card with modern styling */}
       <div className="p-8 border shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl border-white/20">
         {/* Header */}
         <div className="mb-8 text-center">
           <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-800">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
             </svg>
           </div>
           <h2 className="mb-2 text-2xl font-bold text-gray-900">Add Your First Bank Account</h2>
           <p className="text-sm leading-relaxed text-gray-600">
             To get started, please add at least one bank account to your profile.
           </p>
         </div>
         
         {/* Alert Display */}
         {alert.message && (
           <div className={`mb-6 p-4 rounded-xl border ${
             alert.type === 'success' 
               ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
               : alert.type === 'error'
               ? 'bg-red-50 border-red-200 text-red-800'
               : 'bg-blue-50 border-blue-200 text-blue-800'
           }`}>
             <div className="flex items-center">
               <div className="flex-shrink-0">
                 {alert.type === 'success' && (
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                   </svg>
                 )}
                 {alert.type === 'error' && (
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                   </svg>
                 )}
               </div>
               <div className="ml-3 text-sm font-medium">
                 {alert.message}
               </div>
               <button 
                 onClick={() => setAlert({ message: "", type: "info" })}
                 className="ml-auto text-gray-400 hover:text-gray-600"
               >
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                 </svg>
               </button>
             </div>
           </div>
         )}
         
         <div className="space-y-6">
           {/* Bank Name Field */}
           <div>
             <label className="block mb-2 text-sm font-semibold text-gray-700">
               Bank Name
             </label>
             <div className="relative">
               <input
                 type="text"
                 name="bank_name"
                 value={form.bank_name}
                 onChange={handleChange}
                 required
                 className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                 placeholder="Enter your bank name"
               />
             </div>
           </div>
           
           {/* Account Number Field */}
           <div>
             <label className="block mb-2 text-sm font-semibold text-gray-700">
               Account Number
             </label>
             <div className="relative">
               <input
                 type="text"
                 name="account_number"
                 value={form.account_number}
                 onChange={handleChange}
                 required
                 className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                 placeholder="Enter your account number"
               />
             </div>
           </div>
           
           {/* Balance Field */}
           <div>
             <label className="block mb-2 text-sm font-semibold text-gray-700">
               Initial Balance
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                 <span className="font-medium text-gray-500">$</span>
               </div>
               <input
                 type="number"
                 step="0.01"
                 name="balance"
                 value={form.balance}
                 onChange={handleChange}
                 required
                 className="w-full pl-8 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                 placeholder="0.00"
               />
             </div>
           </div>
           
           {/* Submit Button */}
           <button
             onClick={handleSubmit}
             className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-800 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
           >
             Add Account
           </button>
         </div>
         
         {/* Back to Login Link */}
         <div className="mt-6 text-center">
           <button
             onClick={handleBackToLogin}
             className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-indigo-800"
           >
             ← Back to Login
           </button>
         </div>
       </div>
     </div>
   </div>
 );
}