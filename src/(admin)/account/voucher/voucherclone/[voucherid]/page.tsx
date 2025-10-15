'use client';
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
const params=useParams();
const voucherid=params.voucherid;
  return (
    <div>
      {voucherid}
    </div>
  )
}

export default page
