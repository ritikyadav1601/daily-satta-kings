import React from "react";

const Heading = ({ title }) => {
  return (
    <div className="bg-gradient-to-r from-teal-700 via-slate-900 to-sky-700 w-full text-center py-5 px-3">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase">{title}</h1>
    </div>
  );
};

export default Heading;
