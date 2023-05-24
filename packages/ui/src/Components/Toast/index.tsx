import * as T from "@radix-ui/react-toast";
import { ToastAlert } from "./Alert";

export interface IAlert {
  state: "success" | "danger" | "info";
  title: string;
  description?: string;
}

interface IToastProps {
  alerts: IAlert[];
}

export const Toast = ({
  alerts = [{ state: "success", title: "title", description: "description" }],
}: IToastProps) => {
  return (
    <T.Provider>
      {alerts.map((alert, index) => (
        <ToastAlert alert={alert} key={index} />
      ))}
      <T.Viewport className="fixed right-0 bottom-0 p-4 w-full max-w-md gap-4 flex flex-col" />
    </T.Provider>
  );
};
