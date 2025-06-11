import React from 'react'
import { Button } from '~/components/ui/button'
import { mockFiles, mockFolders } from '~/lib/mock-data';
import { db } from '~/server/db';
import { files, folders } from '~/server/db/schema';

export default function Page() {
    return (
        <form action={async () => {
            "use server";
            const fo = await db.insert(folders).values(mockFolders.map((folder) => ({
                id: parseInt(folder.id) + 1,
                name: folder.name + Math.round(Math.random() * 1000),
                parent: folder.parent === 'root' ? 1 : parseInt(folder.parent)
            })))

            const fi = await db.insert(files).values(mockFiles.map(file => ({
                id: parseInt(file.id) + 1,
                name: file.name + Math.round(Math.random() * 1000),
                size: 10,
                url: file.url,
                parent: parseInt(file.parent) + 1
            })))

            console.log(fo, fi, "complete");


        }}>
            <Button type='submit'>push mock data</Button>
        </form>

    )
}
