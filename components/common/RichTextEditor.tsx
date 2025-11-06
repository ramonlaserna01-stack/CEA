import React, { useEffect, useRef } from 'react';

// Quill is loaded from CDN in index.html
declare var Quill: any;

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

const TOOLBAR_OPTIONS = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link'],
    ['clean']
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, readOnly = false }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<any>(null);

    // This effect runs only once on mount to initialize the editor
    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: readOnly ? false : TOOLBAR_OPTIONS,
                },
                placeholder: 'Start drafting your document here...',
                readOnly: readOnly,
            });

            const editor = quillInstance.current;
            if (editor) {
                editor.root.innerHTML = value;

                editor.on('text-change', (delta: any, oldDelta: any, source: string) => {
                    if (source === 'user') {
                        onChange(editor.root.innerHTML);
                    }
                });
            }
        }
    }, []);

    // This effect syncs parent state changes to the editor
    useEffect(() => {
        const editor = quillInstance.current;
        if (editor) {
             // Sync readOnly state
            if (editor.options.readOnly !== readOnly) {
                editor.enable(!readOnly);
                const toolbar = editor.getModule('toolbar');
                if (toolbar) {
                    toolbar.container.style.display = readOnly ? 'none' : 'block';
                }
            }

            // Sync content
            if (editor.root.innerHTML !== value) {
                const selection = editor.getSelection(); // Preserve cursor position
                editor.clipboard.dangerouslyPasteHTML(0, value);
                if (selection) {
                    setTimeout(() => editor.setSelection(selection.index, selection.length), 0);
                }
            }
        }
    }, [value, readOnly]);

    return <div ref={editorRef} className={`h-full w-full bg-white ${readOnly ? 'ql-readonly' : ''}`} />;
};

export default RichTextEditor;