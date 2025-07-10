import { fastifyCors } from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { roomsRoutes } from "./http/rooms/rooms.routes.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: "http://localhost:5173",
});
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.register(fastifySwagger, {
	openapi: {
		info: {
			title: `Letmeask API - ${env.NODE_ENV} - [Version: ${env.VERSION}]`,
			description: "API para a plataforma Letmeask.",
			version: env.VERSION,
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUI, {
	routePrefix: "/",
});

// Routes
app.register(roomsRoutes);

app.listen({ port: env.PORT });
