import { addAlerts } from "@/features/slices/toastSlice";
import { useDispatch } from "react-redux";
import { IAlert } from "ui";

const useToast = () => {
  const dispatch = useDispatch();

  const t = (alerts: IAlert[]) => {
    dispatch(addAlerts(alerts));
  };

  return { t };
};

export default useToast;
