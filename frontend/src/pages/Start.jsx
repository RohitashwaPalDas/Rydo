import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Left Side - Image */}
      <div
        className="w-full lg:w-1/2 h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_690,w_552/v1670497313/assets/f4/8bb09c-2304-4b5d-aa82-7419433ff9a2/original/Illustration_Driver.jpg')",
        }}
      >
        {/* Small screen header */}
        <div className="text-white text-2xl font-bold ml-4 mt-4 prata-regular lg:hidden">
          Rydo
        </div>

        {/* Small screen bottom content */}
        <div className="absolute bottom-0 w-full px-4 py-6 bg-black/40 lg:hidden">
          <h2 className="text-[24px] font-semibold text-white">
            Get Started with Rydo
          </h2>
          <Link
            to="/login"
            className="w-full block bg-white text-black py-3 rounded-lg mt-4 text-center text-lg font-semibold"
          >
            Continue
          </Link>
        </div>
      </div>

      {/* Right Side - Text (Large screen only) */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] text-white items-center justify-center">
        <div className="max-w-md w-full px-10 py-12 bg-[#1e293b] rounded-3xl shadow-lg animate-fadeIn duration-700">
          <h1 className="text-4xl font-bold mb-6 text-center prata-regular">
            Rydo
          </h1>
          <p className="text-xl font-medium text-center mb-8">
            Get Started with Rydo
          </p>
          <Link
            to="/login"
            className="block w-full bg-white text-black text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
