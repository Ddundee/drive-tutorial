import { int, text, singlestoreTable, index, singlestoreTableCreator, bigint } from "drizzle-orm/singlestore-core"

export const createTable = singlestoreTableCreator((name) => `drive-tutorial_${name}`)


export const files = createTable("files_table", {
    id: bigint("id", {mode: "number", unsigned: true}).primaryKey().autoincrement(),
    name: text("name").notNull(),
    size: int("size").notNull(),
    url: text("url").notNull(),
    parent: bigint("parent", {mode: "number", unsigned: true}).notNull(),
}, (t) => {
    return [index("parent_index").on(t.parent)]
})

export const folder = createTable("folders_table", {
    id: bigint("id", {mode: "number", unsigned: true}).primaryKey().autoincrement(),
    name: text("name").notNull(),
    parent: int("parent"),
}, (t) => {
    return [index("parent_index").on(t.parent)]
})