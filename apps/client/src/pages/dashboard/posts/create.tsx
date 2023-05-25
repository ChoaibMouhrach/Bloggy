import React from "react";
import { withAuth } from "@/middlewares";

const Create = withAuth(() => {
  return <div>Create</div>;
});

export default Create;
