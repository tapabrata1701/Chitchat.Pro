import React from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./SocialLogin";
import DarkModeToggle from "./DarkModeToggle";

const AuthForm = ({
  title,
  fields,
  handleSubmit,
  buttonText,
  footerText,
  footerLink,
  footerLinkText,
  error,
  isLoading,
  onGoogleSignIn,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <DarkModeToggle />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id}>{field.component}</div>
          ))}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              buttonText
            )}
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <SocialLogin onGoogleSignIn={onGoogleSignIn} isLoading={isLoading} />

        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          {footerText}{" "}
          <Link
            to={footerLink}
            className="font-medium text-purple-600 hover:underline dark:text-purple-400"
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
