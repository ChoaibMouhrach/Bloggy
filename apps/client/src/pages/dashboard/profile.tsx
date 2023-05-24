import { withAuth } from "@/middlewares";

const Profile = withAuth(() => {
  return <div>Profile</div>;
});

export default Profile;
