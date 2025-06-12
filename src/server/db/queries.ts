import "server-only";

import { db } from "~/server/db";
import {
	files_table as filesSchema,
	folders_table as foldersSchema,
	type DB_FileType,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { z } from "zod";

export const QUERIES = {
	getAllParentsForFolder: async function (folderId: number) {
		const parents = [];
		let currentId: number | null = folderId;
		while (currentId !== null) {
			const folder = await db
				.select()
				.from(foldersSchema)
				.where(eq(foldersSchema.id, currentId));

			if (!folder[0]) {
				break;
			}

			parents.unshift(folder[0]);
			currentId = folder[0]?.parent;
		}
		return parents;
	},

	getFolders: function (folderId: number) {
		return db
			.select()
			.from(foldersSchema)
			.where(eq(foldersSchema.parent, folderId));
	},
	getFiles: function (fileId: number) {
		return db
			.select()
			.from(filesSchema)
			.where(eq(filesSchema.parent, fileId));
	},
	getFolderById: async function (folderId: number) {
		const folder = await db
			.select()
			.from(foldersSchema)
			.where(eq(foldersSchema.id, folderId));

		return folder[0]!;
	},
};

export const MUTATIONS = {
	createFile: async function (input: {
		file: Omit<DB_FileType, "id" | "createdAt">;
		userId: string;
	}) {
		return await db.insert(filesSchema).values({
			...input.file,
			parent: input.file.parent,
		});
	},
};
