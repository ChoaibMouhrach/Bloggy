import React from "react";

interface FormProps extends React.ComponentProps<"form"> {
  children: React.ReactNode;
}

function Form(props: FormProps) {
  return (
    <form
      {...props}
      className="rounded-md border border-stone-300 overflow-hidden"
    />
  );
}

export default Form;
