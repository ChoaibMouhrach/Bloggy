import React from "react";
import PageTitle from "@/Components/PageTitle";
import { withAuth } from "@/middlewares";
import { useSelector } from "react-redux";
import { getUser } from "@/features/slices/userSlice";

const Dashboard = withAuth(() => {

  const user = useSelector(getUser);

  return (
    <>
      <PageTitle
        title="Dashboard"
        description="You can manage your dashboard just from here."
      />
    </>
  );
});

export default Dashboard;
