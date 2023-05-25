import React from "react";

interface PageTitleProps {
  title: string;
  description: string;
}

function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-wide">{title}</h1>
      <p className="text-stone-500 tracking-wide">{description}</p>
    </div>
  );
}

export default PageTitle;
