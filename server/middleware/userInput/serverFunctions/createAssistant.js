// Upload a file with an "assistants" purpose
const file = await openai.files.create({
    file: fs.createReadStream("knowledge.pdf"),
    purpose: "assistants",
  });
  
  // Add the file to the assistant
  const assistant = await openai.beta.assistants.create({
    instructions: "You are a customer support chatbot. Use your knowledge base to best respond to customer queries.",
    model: "gpt-4-turbo",
    tools: [{"type": "retrieval"}],
    file_ids: [file.id]
  });