import React, { Suspense } from 'react'
import PolicyEndorsementForm from '../PolicyEndorsementForm'

function page() {
  return (
    <div >
      <Suspense fallback={<div>Loading...</div>}>
        <PolicyEndorsementForm />
      </Suspense>
    </div>
  )
}

export default page
