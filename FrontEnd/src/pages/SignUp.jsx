const SignUp = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate-fade-in-up mt-20">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm md:text-base">
          Fill in your details to get started
        </p>

        {/* Form */}
        <form className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg 
                         bg-gray-50 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg 
                         bg-gray-50 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg 
                         bg-gray-50 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 
                       rounded-lg hover:bg-blue-700 hover:scale-[1.02] 
                       active:scale-[0.98] transition"
          >
            Sign Up
          </button>
        </form>

        {/* Extra link Abr login page e jabe */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
