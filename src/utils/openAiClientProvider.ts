import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

export class OpenAIClientProvider {
	private readonly sessionMap: Map<string, ChatCompletionMessageParam[]>;
	private openai: OpenAI;
	private readonly openaiModel: string = "gpt-3.5-turbo-0301";
	// private readonly openaiApiKey = "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";
	// private readonly openaiApiKey = "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";
	// private readonly openaiApiKey = 	"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";
	// private readonly openaiApiKey = "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";

	private readonly openaiApiKey = "<Update openai api>";

	constructor() {
		this.sessionMap = new Map<string, ChatCompletionMessageParam[]>();
		this.openai = new OpenAI({
			apiKey: this.openaiApiKey,
			dangerouslyAllowBrowser: true,
		});
	}

	public async submitContent(content: string): Promise<string[]> {
		try {
			const ChatCompletionMessageParam: ChatCompletionMessageParam[] = [{ role: "system", content }];
			const completion = await this.openai.chat.completions.create({
				messages: ChatCompletionMessageParam,
				model: this.openaiModel,
			});

			const response = completion.choices[0].message.content ?? "";
			const conversationArray: string[] = response.split('\n').filter(line => line.trim() !== '');

			console.log(conversationArray);
			return conversationArray;
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	}
}