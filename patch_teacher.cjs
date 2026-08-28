const fs = require('fs');
let code = fs.readFileSync('src/components/SirwiseAITeacher.tsx', 'utf8');

const regex = /let response = "That's an excellent question! Sirwise AI is analyzing your answer\.";[\s\S]*?\} else if \(text\.toLowerCase\(\)\.includes\('final project'\)\) \{[\s\S]*?\}/;
const replacement = `let response = "That's an interesting idea! Let's explore that with AI. What else would you like to learn about?";
      const lowerText = text.toLowerCase();
      if (lowerText.includes('start lesson 1') || lowerText.includes('ai basics')) {
        response = "Lesson 1: AI Basics! AI stands for Artificial Intelligence. It's like giving computers a brain to learn and help us. Can you think of one thing AI helps us with every day?";
      } else if (lowerText.includes('digital creation')) {
        response = "Lesson 2: Digital Creation! You can create art, stories, and videos using digital tools. What would you like to create first?";
      } else if (lowerText.includes('web3') || lowerText.includes('cyber')) {
        response = "Lesson 3: Web3 & Cyber Safety! Web3 is the next internet where you own what you create. Always remember to keep your passwords secret! Are you ready to secure your digital wallet?";
      } else if (lowerText.includes('final project')) {
        response = "Lesson 4: Final Project! Let's build your Capstone. Will it be an AI storybook or a digital gallery? Tell me your idea!";
      } else if (lowerText.includes('tree') || lowerText.includes('story') || lowerText.includes('art')) {
        response = "Great! Let's create a beautiful digital art piece or story with AI! Step 1: Think of a prompt like 'A magical tree with golden leaves'. Ready to try?";
      }`;
code = code.replace(regex, replacement);

fs.writeFileSync('src/components/SirwiseAITeacher.tsx', code);
