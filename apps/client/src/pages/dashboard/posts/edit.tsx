import React from "react";
import { withAuth } from "@/middlewares";

const Edit = withAuth(() => {
  return <div>Edit</div>;
});

export default Edit;
