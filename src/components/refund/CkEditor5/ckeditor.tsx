'use client' 
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5';
import { FormatPainter } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
type Props = {
    value: string;
    onChange: (data: string) => void;
  };
function CustomEditor({ value, onChange }:Props) {
    return (
        <CKEditor
            editor={ ClassicEditor }
            data={value || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChange(data); 
            }}
            config={ {
                licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzYyOTc1OTksImp0aSI6IjA3OGFlNzc1LTBkYmEtNDkzMy1iMTJjLTcyZDM4OTkxYzlhNSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjVhZmFlMmRlIn0.Qn4kmtk3ZAP92lx3PkaTNa2fO66_KH4uhYEvY3caWXAsr7UlJlBAayDY11rEsa3eYipTodlSuou6h2hEmAVDIA',
                plugins: [ Essentials, Paragraph, Bold, Italic],
                toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|', 'formatPainter' ],
                root: {
                    initialData: '<p>Hello from CKEditor 5 in Next.js!</p>'
                }
            } }
        />
    );
}

export default CustomEditor;
