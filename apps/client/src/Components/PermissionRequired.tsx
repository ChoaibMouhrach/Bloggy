import { MdOutlineArrowBack } from "react-icons/md";
import { Button } from "ui";
import { GiSinkingShip } from "react-icons/gi";

const PermissionRequired = () => {
  return (
    <main className="min-h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-6xl font-bold flex items-center gap-4">
          403 <GiSinkingShip />
        </h3>
        <p className="text-neutral-600 text-xl text-center">
          You don't have
          <br />
          the permission to be here
        </p>
        <Button variant="text" className="text-xl" href="/">
          <MdOutlineArrowBack /> Home
        </Button>
      </div>
    </main>
  );
};

export default PermissionRequired;
