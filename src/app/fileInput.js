"use client"

import { useRef } from "react";
import { useRouter } from 'next/navigation';

export default function FileInput({ updateFileName, updateFileJSON, updateBaseScmPath }) {
    const router = useRouter();
    const inputFile = useRef();
    const scmPath = useRef();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!inputFile.current.files.length) {
            console.error('No file selected');
            return;
        }
        var fileDetails = inputFile.current.files[0];

        // validate file is json
        if (fileDetails.type !== 'application/json') {
            console.error('File is not JSON');
            return;
        }

        // svn base path must start with https://
        if (scmPath.current.value) {
            if (!scmPath.current.value.startsWith('https://')) {
                console.error('SVN path must start with https://');
                return;
            }
            else {
                if (!scmPath.current.value.endsWith('/')) {
                    scmPath.current.value = scmPath.current.value + '/';
                }
            }
        }

        await updateBaseScmPath(scmPath.current.value);

        const reader = new FileReader();

        reader.onload = async (e) => {
            const text = (e.target.result);
            const json = JSON.parse(text);
            await updateFileJSON(json);
        };
        reader.readAsText(inputFile.current.files[0]);

        await updateFileName(fileDetails.name);
        // refresh the page to show the new collection - next.js server component does not re-run on client side navigation
        router.refresh();
    }

    return (
        <div className="bg-bg-top-gray border-bg-top-gray bg-opacity-100 border-b-slate-400">
            <form onSubmit={handleSubmit} className="grow p-2">
                <label htmlFor="file" className="px-1"> Choose Semgrep out file:</label >
                <input type="file" ref={inputFile} id="file" name="Semgrep Output File" accept=".json" />

                <label htmlFor="scmPath" className="px-1">Code Org path:</label>
                <input type="text" ref={scmPath} name="scmPath" placeholder="https://gitlab.com/myorg" className="w-64 text-sm" />

                <button type="submit" value="Submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold mx-4 px-4 rounded-full" >Load</button>
            </form >
        </div >
    );
}