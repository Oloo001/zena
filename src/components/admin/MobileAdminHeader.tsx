"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 
import AdminSidebar from "./AdminSidebar";

export default function MobileAdminHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 h-16">
      <span className="font-bold text-indigo-600 italic">ZENA ADMIN</span>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-50 text-gray-600"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay Sidebar for Mobile */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 animate-in slide-in-from-left duration-300">
            <AdminSidebar onNavItemClick={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}