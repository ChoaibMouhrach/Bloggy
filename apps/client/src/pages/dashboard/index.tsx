import { withAuth } from "@/middlewares";

const Dashboard = withAuth(() => {
  return <div>Dashboard</div>;
});

export default Dashboard;
