import { withAuth } from "@/middlewares";

const Create = withAuth(() => {
  return <div>Create</div>;
});

export default Create;
