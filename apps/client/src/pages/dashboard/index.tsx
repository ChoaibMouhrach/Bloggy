import React from "react";
import PageTitle from "@/Components/PageTitle";
import { withAuth } from "@/middlewares";

const Dashboard = withAuth(() => {
  return (
    <PageTitle
      title="Dashboard"
      description="You can manage your dashboard just from here."
    />
  );
});

export default Dashboard;
