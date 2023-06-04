import { useDispatch } from "react-redux";
import { IAlert } from "ui";
import { addAlerts, removeAlert } from "@/features/Toast/toast.slice";

const useToast = () => {
  const dispatch = useDispatch();

  const t = (alerts: Omit<IAlert, "id">[]) => {
    const id: number = Math.floor(Math.random() * 9999) + 1000;

    dispatch(addAlerts(alerts.map((alert) => ({ id, ...alert }))));

    setTimeout(() => {
      dispatch(removeAlert(id));
    }, 5000);
  };

  return { t };
};

export default useToast;
