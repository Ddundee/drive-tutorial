"use server";

import { auth } from "@clerk/nextjs/server";
import {
	files_table,
	folders_table,
	type DB_FileType,
	type DB_FolderType,
} from "./db/schema";
import { db } from "./db";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
	const session = await auth();

	if (!session.userId) {
		return { error: "Unauthorized" };
	}

	const [file] = await db
		.select()
		.from(files_table)
		.where(
			and(
				eq(files_table.id, fileId),
				eq(files_table.ownerId, session.userId),
			),
		);
	if (!file) {
		return { error: "File not found" };
	}

	const utapiResult = await utApi.deleteFiles([file.fileKey]);

	await db.delete(files_table).where(eq(files_table.id, fileId));

	const c = await cookies();
	c.set("force-refresh", JSON.stringify(Math.random()));

	return utapiResult;
}

async function forceDeleteFiles(files: DB_FileType[]) {
	const fileKeys = [];
	for (const { fileKey, id } of files) {
		fileKeys.push(fileKey);
		db.delete(files_table).where(eq(files_table.id, id));
	}

	const utapiResult = await utApi.deleteFiles(fileKeys);
	return utapiResult;
}

export async function deleteFolder(folderId: number) {
	try {
		const session = await auth();
		if (!session.userId) {
			return { error: "Unauthorized" };
		}

		const foldersPromise = db
			.select()
			.from(folders_table)
			.where(
				and(
					eq(folders_table.parent, folderId),
					eq(folders_table.ownerId, session.userId),
				),
			);

		const filesPromise = db
			.select()
			.from(files_table)
			.where(
				and(
					eq(files_table.parent, folderId),
					eq(files_table.ownerId, session.userId),
				),
			);

		const [folders, files] = await Promise.all([
			foldersPromise,
			filesPromise,
		]);

		await forceDeleteFiles(files);

		for (const folder of folders) {
			await deleteFolder(folder.id);
		}

		await db.delete(folders_table).where(eq(folders_table.id, folderId));

		const c = await cookies();
		c.set("force-refresh", JSON.stringify(Math.random()));

		return { success: true };
	} catch (error) {
		return { error: "Failed to delete folder" };
	}
}

export async function createFolder(input: {
	folder: Omit<DB_FolderType, "id" | "createdAt" | "ownerId">;
}) {
	const session = await auth();

	if (!session.userId) {
		return { error: "Unauthorized" };
	}

	await db
		.insert(folders_table)
		.values({ ...input.folder, ownerId: session.userId });

	const c = await cookies();
	c.set("force-refresh", JSON.stringify(Math.random()));

	return { success: true };
}
