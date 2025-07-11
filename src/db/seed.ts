import { reset, seed } from "drizzle-seed";
import { db, sql } from "./connection.ts";
import { schema } from "./schemas/index.ts";

await reset(db, schema);

await seed(db, schema).refine((f) => {
	return {
		rooms: {
			count: 20,
			columns: {
				name: f.valuesFromArray({
					values: [
						"Frontend Development",
						"Backend Architecture",
						"Database Design",
						"DevOps & CI/CD",
						"Mobile Development",
						"UI/UX Design",
						"System Architecture",
						"Web Security",
						"Performance Optimization",
						"Code Review",
						"Testing Strategies",
						"API Development",
						"Cloud Computing",
						"Microservices",
						"Data Science",
						"Machine Learning",
						"Product Management",
						"Agile Methodologies",
						"JavaScript Ecosystem",
						"Open Source Projects",
					],
					isUnique: true,
				}),
				description: f.valuesFromArray({
					values: [
						"Discuss latest trends and best practices",
						"Share knowledge and solve problems together",
						"Ask questions and get expert advice",
						"Collaborate on challenging projects",
						"Learn from experienced professionals",
						"Exchange ideas and innovative solutions",
						"Deep dive into technical concepts",
						"Build community and network",
						"Stay updated with industry standards",
						"Mentor and be mentored by peers",
					],
				}),
			},
		},
		questions: {
			count: 100,
			columns: {
				question: f.valuesFromArray({
					values: [
						"O que é TypeScript e quais suas vantagens?",
						"Como funciona o ciclo de vida de um componente React?",
						"Quais são as diferenças entre REST e GraphQL?",
						"Como garantir a segurança em APIs web?",
						"O que é CI/CD e por que é importante?",
						"Como otimizar a performance de aplicações frontend?",
						"Quais padrões de arquitetura são comuns em backend?",
						"Como funciona o gerenciamento de estado no Redux?",
						"O que são microserviços e quando usá-los?",
						"Como versionar uma API de forma eficiente?",
						"Quais são as melhores práticas para testes automatizados?",
						"Como funciona o controle de concorrência em bancos de dados?",
						"O que é DevOps e como implementá-lo na empresa?",
						"Como lidar com autenticação e autorização em aplicações web?",
						"Quais são os principais desafios em mobile development?",
						"Como aplicar Clean Code em projetos grandes?",
						"O que é Domain Driven Design (DDD)?",
						"Como funciona o deploy em cloud providers?",
						"Quais são as vantagens do uso de containers?",
						"Como escalar uma aplicação para milhares de usuários?",
					],
				}),
				answer: f.valuesFromArray({
					values: [
						"TypeScript é um superset do JavaScript que adiciona tipagem estática, facilitando a manutenção e reduzindo bugs.",
						"O ciclo de vida de um componente React envolve fases como montagem, atualização e desmontagem, permitindo controlar comportamentos em cada etapa.",
						"REST é baseado em recursos e HTTP, enquanto GraphQL permite consultas flexíveis e retorna apenas os dados necessários.",
						"A segurança em APIs web pode ser garantida com autenticação, autorização, validação de dados e uso de HTTPS.",
						"CI/CD automatiza testes e deploys, aumentando a agilidade e reduzindo erros em produção.",
						"Para otimizar performance frontend, use lazy loading, minimize bundles e evite re-renderizações desnecessárias.",
						"Padrões como MVC, Clean Architecture e Hexagonal são comuns em backend para organizar o código.",
						"Redux gerencia o estado global da aplicação por meio de actions, reducers e uma store centralizada.",
						"Microserviços dividem a aplicação em serviços independentes, facilitando escalabilidade e manutenção.",
						"Versione APIs usando versionamento na URL, headers ou content negotiation para evitar breaking changes.",
						"Boas práticas de testes incluem TDD, cobertura de código e testes de integração e ponta a ponta.",
						"Controle de concorrência em bancos de dados pode ser feito com locks, transações e isolamento de níveis.",
						"DevOps integra desenvolvimento e operações, promovendo automação e colaboração contínua.",
						"Autenticação verifica identidade, autorização define permissões; use JWT, OAuth e RBAC para reforçar.",
						"Desafios em mobile incluem fragmentação de dispositivos, performance e experiência do usuário.",
						"Clean Code envolve nomes claros, funções pequenas e código legível, facilitando manutenção.",
						"DDD foca no domínio do negócio, usando modelos e linguagens ubiquas para alinhar código e regras.",
						"Deploy em cloud pode ser feito via pipelines automatizados, containers e infraestrutura como código.",
						"Containers isolam aplicações, facilitando portabilidade, escalabilidade e consistência de ambiente.",
						"Escalar exige balanceamento de carga, cache, replicação e monitoramento contínuo.",
					],
				}),
			},
		},
	};
});

await sql.end();

// biome-ignore lint/suspicious/noConsole: <Only used in dev>
console.log("Database seeded");
