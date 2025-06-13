"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { createFolder } from "~/server/actions";
import { toast } from "sonner";

export default function NewFolder(props: { parentId: number }) {

    const [value, setValue] = useState("");

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">New Folder</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enter Folder Name</DialogTitle>
                </DialogHeader>
                <Input value={value} placeholder="documents" onChange={(e) => setValue(e.target.value)} />

                <DialogFooter className="sm:justify-start justify-between">
                    <DialogClose asChild>
                        <Button type="button" disabled={!value} variant="secondary" onClick={() => {
                            toast.loading("Creating folder...", { id: "create-folder" })
                            createFolder({
                                folder: {
                                    name: value,
                                    parent: props.parentId
                                }
                            })
                                .then(() => toast.success("Created folder!", { id: "create-folder" }))
                                .catch(() => toast.error("Unable to create folder.", { id: "create-folder" }))
                        }}>Submit</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}