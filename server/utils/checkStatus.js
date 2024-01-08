import { openai } from "../services/openAiAssistant.js";

async function main() {
    const run = await openai.beta.threads.runs.retrieve(
        "thread_062QdTjrY9CnDmd6UPRtjc8N",
        "run_abc123"
    );

    console.log(run);
}

main();