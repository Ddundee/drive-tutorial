import { Folder as FolderIcon, FileIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile, deleteFolder } from "~/server/actions";
import prettyBytes from "pretty-bytes"

import type { folders_table, files_table } from "~/server/db/schema";
import { toast } from "sonner";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
    const { file } = props;
    return (
        <li
            key={file.id}
            className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
        >
            <div className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-6 flex items-center">
                    <Link
                        href={file.url}
                        className="flex items-center text-gray-100 hover:text-blue-400"
                    >
                        <FileIcon className="mr-3" size={20} />
                        {file.name}
                    </Link>
                </div>
                <div className="col-span-2 text-gray-400">{file.fileType}</div>
                <div className="col-span-2 text-gray-400">{prettyBytes(file.size)}</div>
                <div className="col-span-2 text-gray-400"><Button variant={"destructive"} onClick={() => {
                    toast.loading("Deleting file...", { id: `file-delete-${props.file.id}` })
                    deleteFile(file.id)
                        .catch(() => toast.error("Unable to delete file.", { id: `file-delete-${props.file.id}` }))
                        .then(() => toast.success("Deleted file!", { id: `file-delete-${props.file.id}` }))

                }}><Trash2Icon className="" size={20} /></Button></div>
            </div>
        </li>
    );
}

export function FolderRow(props: {
    folder: typeof folders_table.$inferSelect;
}) {
    const { folder } = props;
    return (
        <li
            key={folder.id}
            className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
        >
            <div className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-6 flex items-center">
                    <Link
                        href={`/f/${folder.id}`}
                        // onClick={() => handleFolderClick()}
                        className="flex items-center text-gray-100 hover:text-blue-400"
                    >
                        <FolderIcon className="mr-3" size={20} />
                        {folder.name}
                    </Link>
                </div>
                <div className="col-span-2 text-gray-400"></div>
                <div className="col-span-2 text-gray-400"></div>
                <div className="col-span-2 text-gray-400"><Button variant={"destructive"} onClick={() => {
                    toast.loading("Deleting folder...", { id: `folder-delete-${props.folder.id}` })
                    deleteFolder(folder.id)
                        .catch(() => toast.error("Unable to delete folder.", { id: `folder-delete-${props.folder.id}` }))
                        .then(() => toast.success("Deleted folder!", { id: `folder-delete-${props.folder.id}` }))

                }}><Trash2Icon className="" size={20} /></Button></div>
            </div>
        </li>
    );
}
