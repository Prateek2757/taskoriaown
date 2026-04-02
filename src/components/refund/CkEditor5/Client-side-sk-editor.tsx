'use client' 

import dynamic from 'next/dynamic';

const ClientSideCustomEditor = dynamic( () => import( '@/components/refund/CkEditor5/ckeditor' ), { ssr: false } );

export default ClientSideCustomEditor;
