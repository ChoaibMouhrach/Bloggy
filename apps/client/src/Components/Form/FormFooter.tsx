import React from "react";

function FormFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-stone-300 bg-stone-100 p-3">{children}</div>
  );
}

export default FormFooter;
