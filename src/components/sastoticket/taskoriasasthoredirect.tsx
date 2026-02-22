import { useSession } from "next-auth/react";

const TaskoriaSasthoRedirect = () => {
  const { data: session } = useSession();

  const handleRedirect = () => {
    if (!session?.user) return;

    const userData = {
      name: session.user.name,
      email: session.user.email,
    };

    const jsonString = JSON.stringify(userData);
console.log(jsonString,"jaso");

    const base64Data = btoa(jsonString);


    window.location.href = `http://hotel.taskoria.com/?data=${base64Data}`;
  };

  return (
    <>

      <button className="text-black" onClick={handleRedirect}>
        Sastho ticket
      </button>
    </>
  );
};

export default TaskoriaSasthoRedirect;
