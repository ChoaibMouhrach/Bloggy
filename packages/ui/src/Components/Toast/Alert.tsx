import * as T from "@radix-ui/react-toast";
import { useEffect, useState } from "react";
import { IAlert } from ".";
import { MdClose } from "react-icons/md";

interface IToastAlertProps {
  alert: IAlert;
}

export const ToastAlert = ({ alert }: IToastAlertProps) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  }, []);

  return (
    <T.Root
      className={`${
        alert.state === "success"
          ? "bg-green-600"
          : alert.state === "danger"
          ? "bg-red-600"
          : "bg-stone-800"
      } tracking-wide flex rounded-md py-3 px-4`}
      open={open}
    >
      <div className="w-full">
        <T.Title className="text-white font-semibold">{alert.title}</T.Title>
        <T.Description className="text-white">
          {alert.description}
        </T.Description>
      </div>
      <T.Action altText="Unfod" asChild className="text-white text-xl ">
        <button
          onClick={() => setOpen(false)}
          className="p-0 flex items-center h-fit my-auto"
        >
          <MdClose className="fill-white" />
        </button>
      </T.Action>
    </T.Root>
  );
};
