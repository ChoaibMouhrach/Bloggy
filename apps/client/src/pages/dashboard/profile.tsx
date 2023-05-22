import { useGetProfileQuery } from "@/features/apis/authApi";
import withAuth from "@/middlewares/withAuth";
import { useRouter } from "next/router";
import { Button } from "ui";

const Profile = withAuth(() => {
  const router = useRouter();
  const { data: user } = useGetProfileQuery();

  const handleSubmit = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/sign-in");
  };

  return (
    <div className="p-8">
      {user?.username}
      <Button onClick={handleSubmit}>Log Out</Button>
    </div>
  );
});

export default Profile;
