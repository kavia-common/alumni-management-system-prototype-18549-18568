import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <div className="text-8xl font-black text-blue-600">404</div>
        <h1 className="mt-4 text-2xl font-semibold">Page Not Found</h1>
        <p className="text-gray-600 mt-2">The page you’re looking for does not exist.</p>
        <Link className="btn btn-primary mt-6" to="/">Go Home</Link>
      </div>
    </div>
  );
}
