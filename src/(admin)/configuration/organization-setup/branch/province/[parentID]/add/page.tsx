"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import BranchForm from "../../../components/BranchForm";

function Page() {
  const { parentID } = useParams();

  return (
    <div>
      <BranchForm parentId={parentID} />
    </div>
  );
}

export default Page;
