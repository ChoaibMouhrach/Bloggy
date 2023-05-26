import React from "react";

function FormBody({ children }: { children: React.ReactNode }) {
  return <div className="rounded-t-md p-3 flex flex-col gap-4">{children}</div>;
}

export default FormBody;
