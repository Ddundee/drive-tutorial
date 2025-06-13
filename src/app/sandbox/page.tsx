import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import React from "react";
import { Button } from "~/components/ui/button";
import { mockFolders } from "~/lib/mock-data";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

export default async function Page() {

    const user = await auth();
    if (!user.userId) {
        throw new Error("User not found")
    }
    await db.select().from(folders_table).where(eq(folders_table.ownerId, user.userId))

    return (
        <div>
            <form action={async () => {
                "use server";

                const user = await auth();

                if (!user.userId) {
                    throw new Error("User not found!");
                }

                const rootFolder = await db.insert(folders_table).values({
                    name: "root",
                    ownerId: user.userId,
                    parent: null,
                }).$returningId()

                const insertableFolder = mockFolders.map((folder) => ({
                    name: folder.name,
                    ownerId: user.userId,
                    parent: rootFolder[0]!.id
                }))

                await db.insert(folders_table).values(insertableFolder)
            }}>
                <Button type="submit">Create Folders</Button>
            </form>

            <form
                action={async () => {
                    "use server";
                    db.delete(folders_table);
                    db.delete(files_table);
                }}
            >
                <Button>delete all data</Button>
            </form>
        </div>
    );
}
