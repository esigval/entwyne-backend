import getStoryline from "../getStoryline.js";
import OpenAI from "openai";

const openai = new OpenAI();
const storylineName = 'Generated Storyline Name'; // This could be generated or provided by the user
const storyline = getStoryline(storylineName);

const createDirectorThread = async () => {
    const startStorySession = await openai.beta.threads.create({
        messages: [
            {
              role: "user",
              content: "Hello, ",
            },
          ],}
    );

    console.log(emptyThread);
}

main();