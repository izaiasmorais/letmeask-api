import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

export const gemini = new GoogleGenAI({
	apiKey: env.GEMINI_API_KEY,
});

const highQualityModel = "gemini-2.5-pro";
// const fastModel = "gemini-2.5-flash";
const embeddingModel = "text-embedding-004";

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
	const response = await gemini.models.generateContent({
		model: highQualityModel,
		contents: [
			{
				text: "Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição. Mentenha a pontuação adequada e divida o texto em parágrafos quando necessário.",
			},
			{
				inlineData: {
					mimeType,
					data: audioAsBase64,
				},
			},
		],
	});

	if (!response.text) {
		throw new Error("Não foi possível transcrever o áudio");
	}

	return response.text;
}

export async function generateEmbeddings(text: string) {
	const response = await gemini.models.embedContent({
		model: embeddingModel,
		contents: [{ text }],
		config: {
			taskType: "RETRIEVAL_DOCUMENT",
		},
	});

	if (!response.embeddings?.[0].values) {
		throw new Error("Não foi possível gerar os embeddings");
	}

	return response.embeddings[0].values;
}

export async function generateAnswer(
	question: string,
	transcriptions: string[]
) {
	const context = transcriptions.join("\n\n");

	const prompt =`
		Com base no texto fornecido abaixo, responda a pergunta de forma clara e precisa em português do Brasil.

		CONTEXTO: ${context}

		PERGUNTA: ${question}

		INSTRUÇÕES:
		- Use apenas informações do contexto para responder a pergunta.
		- Se não houver informações suficientes no contexto, responda que não há informações suficientes.
		- Se a pergunta não for relacionada ao contexto, responda que não há informações suficientes.
		- Se a pergunta for uma pergunta de opinião, responda de forma neutra e não inclua nenhum tipo de opinião.
		- Se a pergunta for uma pergunta de opinião, responda de forma neutra e não inclui
		- Mantenha um tom educativo e profissional.
		- Se a pergunta for uma pergunta de opinião, responda de forma neutra e não inclui
		- Mantenha um tom educativo e profissional.
		- Se for citar o contexto, utilize o termo "conteúdo da aula"
		- Só cite o contexto se for necessário para responder a pergunta.
		- Caso no contexto não haja informações suficientes para responder a pergunta, responda que não há informações suficientes.
	`;

	const response = await gemini.models.generateContent({
		model: highQualityModel,
		contents: [
			{
				text: prompt,
			},
		],
	});

	if (!response.text) {
		throw new Error("Não foi possível gerar a resposta");
	}

	return response.text;
}
