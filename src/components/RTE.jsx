import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({
    control,
    name = 'content',
    defaultValue = JSON.stringify(''),
    label,
    toolbar = 'undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    plugins = [
        'image',
        'advlist',
        'autolink',
        'lists',
        'link',
        'charmap',
        'preview',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'code',
        'help',
        'wordcount',
        'paste',
    ],
    height = 500,
    contentStyle = 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    error,
    wrapperClass = 'w-full',
    labelClass = 'inline-block mb-1 pl-1',
    setup = (editor) => {

        editor.on('paste', (e) => {
            const htmlContent = e.clipboardData.getData('text/html'); // Get pasted HTML
            const textContent = e.clipboardData.getData('text/plain'); // Fallback to plain text

            if (htmlContent) {
                e.preventDefault();
                // console.log("Pasted HTML Content:", htmlContent);
                editor.insertContent(htmlContent); // Insert the HTML content directly
            } else if (textContent) {
                e.preventDefault();
                // console.log("Pasted Text Content:", textContent);
                editor.insertContent(`<p>${textContent}</p>`); // Wrap plain text in <p> tags
            }
        });
    }
}) {
    return (
        <div className={wrapperClass}>
            {label && <label className={labelClass}>{label}</label>}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey="qd8wekmhrrn23fc8m64hofgon22nzvabczrei84552rduchd"
                        initialValue={defaultValue}
                        init={{
                            height,
                            menubar: true,
                            plugins,
                            toolbar,
                            paste_as_text: false, // Ensures HTML content is not converted to plain text
                            paste_auto_cleanup_on_paste: true, // Cleans up unwanted tags or attributes
                            paste_data_images: true, // Allows pasting images as data URIs
                            content_style: contentStyle, // Defines editor content styles
                            setup,
                            valid_elements: '*[*]', // Allow all HTML elements and attributes
                            extended_valid_elements: 'span[style],b[style],i[style],p[style],h1[style]', // Extend to allow inline styles
                        }}
                        onEditorChange={(content) => {
                            onChange(JSON.stringify(content))
                        }}
                    />
                )}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
}
