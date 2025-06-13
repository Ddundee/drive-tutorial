import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {

    const session = await auth();

    if (!session.userId) {
        return redirect("/sign-in");
    }

    const [rootFolder] = await QUERIES.getRootFolderForUser(session.userId)

    if (!rootFolder) {
        return (
            <form action={async () => {
                "use server";
                const id = await MUTATIONS.onboardUser(session.userId)

                redirect(`/f/${id}`)
            }}>
                <Button type="submit">Create Root Folder</Button>
            </form>
        )
    }

    return redirect(`/f/${rootFolder.id}`)
}