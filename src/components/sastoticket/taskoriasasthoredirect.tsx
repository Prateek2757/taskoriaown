"use client";

import { useSession } from "next-auth/react";

const TaskoriaSasthoRedirect = () => {
  const { data: session } = useSession();
const phone_number = session?.user.phone
  const handleRedirect = async () => {
    if (!session?.user) {
      alert("Login first");
      return;
    }

    const res = await fetch("/api/SasthoTicket/redirect");
    const data = await res.json();

    window.open(data.url, "_blank");
  };

  return <button onClick={handleRedirect}>Sasto Ticket</button>;
};

export default TaskoriaSasthoRedirect;