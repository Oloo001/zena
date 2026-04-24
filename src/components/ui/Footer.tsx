"use client";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-4 mt-8">
      <div className="max-w-4xl mx-auto text-center text-gray-400">
       <b> &copy;{new Date().getFullYear()} City Hire Ltd. All rights reserved. </b>
      </div>
    </footer>
  );
}