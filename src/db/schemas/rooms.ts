import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { getCurrentDate } from "../../utils/get-current-date.ts";

export const rooms = pgTable("rooms", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp()
		.defaultNow()
		.notNull()
		.$defaultFn(() => getCurrentDate()),
	updatedAt: timestamp()
		.defaultNow()
		.notNull()
		.$defaultFn(() => getCurrentDate()),
});
