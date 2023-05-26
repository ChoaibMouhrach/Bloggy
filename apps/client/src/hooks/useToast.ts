import { useDispatch } from "react-redux";
import { IAlert } from "ui";
import { addAlerts } from "@/features/slices/toastSlice";

const useToast = () => {
  const dispatch = useDispatch();

  const t = (alerts: IAlert[]) => {
    dispatch(addAlerts(alerts));
  };

  return { t };
};

export default useToast;
