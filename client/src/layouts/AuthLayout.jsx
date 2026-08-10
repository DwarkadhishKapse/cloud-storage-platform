import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden bg-emerald-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              ClouD
            </h1>

            <p className="mt-3 max-w-md text-lg leading-8 text-emerald-50">
              Store, organize, and access your files securely from anywhere.
            </p>
          </div>

          <div>
            <div className="max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <p className="text-2xl font-semibold leading-9 text-white">
                Your files.
                <br />
                Your space.
                <br />
                Your ClouD.
              </p>

              <p className="mt-5 text-sm leading-6 text-emerald-50">
                Keep your documents, photos, and important files organized in
                one secure place.
              </p>
            </div>
          </div>

          <p className="text-sm text-emerald-100">
            Secure cloud storage platform
          </p>
        </div>

        <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <h1 className="text-4xl font-bold tracking-tight text-emerald-600">
                ClouD
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Secure cloud storage for your files
              </p>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;