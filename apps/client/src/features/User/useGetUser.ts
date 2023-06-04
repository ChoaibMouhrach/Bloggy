import { useSelector } from "react-redux";
import { getUser } from "@/features/User/user.slice";

const useGetUser = () => useSelector(getUser);

export default useGetUser;
