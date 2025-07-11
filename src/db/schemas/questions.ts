import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { getCurrentDate } from "../../utils/get-current-date.ts";
import { rooms } from "./rooms.ts";

export const questions = pgTable("questions", {
	id: uuid().primaryKey().defaultRandom(),
	roomId: uuid()
		.references(() => rooms.id)
		.notNull(),
	question: text().notNull(),
	answer: text(),
	createdAt: timestamp()
		.defaultNow()
		.notNull()
		.$defaultFn(() => getCurrentDate()),
	updatedAt: timestamp()
		.defaultNow()
		.notNull()
		.$defaultFn(() => getCurrentDate()),
});
