"use client";
import { Fragment } from "react";
import { FileRow, FolderRow } from "./file-row";
import type { files_table, folders_table } from "~/server/db/schema";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "~/components/uploadthing";
import { useRouter } from "next/navigation";
import NewFolder from "~/components/new-folder";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { toast } from "sonner";

export default function DriveContents(props: {
    files: (typeof files_table.$inferSelect)[];
    folders: (typeof folders_table.$inferSelect)[];
    parents: (typeof folders_table.$inferSelect)[];
    currentFolderId: number
}) {

    const navigate = useRouter();

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/f/${props.parents[0]!.id}`} className="text-gray-300 hover:text-white">My Drive</BreadcrumbLink>
                                </BreadcrumbItem>
                                {props.parents.slice(1, 2).map((folder) => (
                                    // <div key={folder.id} className="flex items-center">
                                    //     <ChevronRight
                                    //         className="mx-2 text-gray-500"
                                    //         size={16}
                                    //     />
                                    //     <Link
                                    //         href={`/f/${folder.id}`}
                                    //         className="text-gray-300 hover:text-white"
                                    //     >
                                    //         {folder.name}
                                    //     </Link>
                                    // </div>
                                    <Fragment key={folder.id}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={`/f/${folder.id}`} className="text-gray-300 hover:text-300">{folder.name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </Fragment>
                                ))}
                                {
                                    props.parents.length > 3 &&
                                    <Fragment>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbEllipsis />
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={`/f/${props.parents[props.parents.length - 1]?.id}`} className="text-gray-300 hover:text-300">{props.parents[props.parents.length - 1]?.name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </Fragment>
                                }
                                {
                                    props.parents.length === 3 &&
                                    <Fragment>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={`/f/${props.parents[props.parents.length - 1]?.id}`} className="text-gray-300 hover:text-300">{props.parents[props.parents.length - 1]?.name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </Fragment>
                                }

                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex gap-3 justify-center items-center">
                        <UploadButton endpoint="driveUploader" onClientUploadComplete={() => {
                            navigate.refresh()
                            toast.success("Uploaded files!", { id: "upload-file" })
                        }} input={{ folderId: props.currentFolderId }} onUploadBegin={() => toast.loading("Uploading file(s)...", { id: "upload-file" })} onUploadAborted={() => { toast.error("Unable to upload file", { id: "upload-file" }) }} onUploadError={() => { toast.error("Unable to upload file", { id: "upload-file" }) }} />
                        {/* <form action={() => {
                            createFolder({
                                folder: {
                                    name: `test${Math.round(Math.random() * 100)}`,
                                    parent: props.parents[props.parents.length - 1]!.id
                                }
                            })
                        }}>
                            <Button variant={"secondary"} type="submit">New Folder</Button>
                        </form> */}
                        <NewFolder parentId={props.parents[props.parents.length - 1]!.id} />
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
                <div className="rounded-lg bg-gray-800 shadow-xl">
                    <div className="border-b border-gray-700 px-6 py-4">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                            <div className="col-span-6">Name</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-2">Size</div>
                            <div className="col-span-2"></div>
                        </div>
                    </div>
                    <ul>
                        {props.folders.map((folder) => (
                            <FolderRow key={folder.id} folder={folder} />
                        ))}
                        {props.files.map((file) => (
                            <FileRow key={file.id} file={file} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
