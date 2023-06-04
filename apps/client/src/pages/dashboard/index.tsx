import React from "react";
import PageTitle from "@/Components/PageTitle";
import { withAuth } from "@/middlewares";
import { ROLES } from "@/config/constants";

const Dashboard = withAuth(() => {
  return (
    <PageTitle
      title="Dashboard"
      description="You can manage your dashboard just from here."
    />
  );
}, [ROLES.ADMIN]);

export default Dashboard;
