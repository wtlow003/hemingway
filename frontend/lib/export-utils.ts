import { models } from "./constants"
import { toast } from "@/hooks/use-toast"

export const generateExportContent = (format: string, prompt: string, model: string): string => {
  const selectedModelData = models.find((m) => m.value === model)
  const provider = selectedModelData?.provider || "OpenAI"
  const modelName = selectedModelData?.label || "GPT-4"

  switch (format) {
    case "api-json":
      if (provider === "OpenAI") {
        return JSON.stringify(
          {
            model: model,
            messages: [
              {
                role: "system",
                content: prompt,
              },
              {
                role: "user",
                content: "Your first task is to...",
              },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          },
          null,
          2,
        )
      } else if (provider === "Anthropic") {
        return JSON.stringify(
          {
            model: model,
            max_tokens: 1000,
            system: prompt,
            messages: [
              {
                role: "user",
                content: "Your first task is to...",
              },
            ],
          },
          null,
          2,
        )
      } else if (provider === "Google") {
        return JSON.stringify(
          {
            contents: [
              {
                role: "system",
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
              {
                role: "user",
                parts: [
                  {
                    text: "Your first task is to...",
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          },
          null,
          2,
        )
      }
      break

    case "plain-text":
      return prompt

    case "markdown":
      return `# Optimized System Prompt for ${modelName}

## Model Information
- **Model**: ${modelName}
- **Provider**: ${provider}
- **Optimized**: ${new Date().toLocaleDateString()}

## Prompt Content

\`\`\`
${prompt}
\`\`\`

## Usage Notes
${provider === "OpenAI" ? "- Use as system message for best results\n- Adjust temperature based on creativity needs" : ""}${provider === "Anthropic" ? "- Use as system prompt\n- Works well with conversational context" : ""}${provider === "Google" ? "- Use as system role message\n- Supports multimodal inputs" : ""}

## API Integration
This system prompt has been optimized for ${modelName} and should be used with the appropriate API parameters for best results.
`

    case "curl":
      if (provider === "OpenAI") {
        return `curl -X POST "https://api.openai.com/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{
    "model": "${model}",
    "messages": [
      {
        "role": "system",
        "content": "${prompt.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"
      },
      {
        "role": "user",
        "content": "Your first task is to..."
      }
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'`
      } else if (provider === "Anthropic") {
        return `curl -X POST "https://api.anthropic.com/v1/messages" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "${model}",
    "system": "${prompt.replace(/"/g, '\\"').replace(/\n/g, "\\n")}",
    "max_tokens": 1000,
    "messages": [
      {
        "role": "user",
        "content": "Your first task is to..."
      }
    ]
  }'`
      }
      break

    case "python":
      if (provider === "OpenAI") {
        return `from openai import OpenAI

# Initialize the client
client = OpenAI(api_key="your_api_key")  # Replace with your API key or use environment variable

# System prompt (optimized for ${modelName})
system_prompt = """${prompt}"""

# Example conversation
response = client.chat.completions.create(
    model="${model}",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Your first task is to..."}
    ],
    temperature=0.7,
    max_tokens=1000
)

# Print the response
print(response.choices[0].message.content)`
      } else if (provider === "Anthropic") {
        return `from anthropic import Anthropic

# Initialize the client
client = Anthropic(api_key="your_api_key")  # Replace with your API key or use environment variable

# System prompt (optimized for ${modelName})
system_prompt = """${prompt}"""

# Example conversation
response = client.messages.create(
    model="${model}",
    system=system_prompt,
    messages=[
        {"role": "user", "content": "Your first task is to..."}
    ],
    max_tokens=1000
)

# Print the response
print(response.content[0].text)`
      } else if (provider === "Google") {
        return `import google.generativeai as genai

# Configure the client
genai.configure(api_key="your_api_key")  # Replace with your API key or use environment variable

# System prompt (optimized for ${modelName})
system_prompt = """${prompt}"""

# Initialize the model
model = genai.GenerativeModel("${model}")

# Example conversation
response = model.generate_content(
    [
        {"role": "system", "parts": [system_prompt]},
        {"role": "user", "parts": ["Your first task is to..."]}
    ],
    generation_config={
        "temperature": 0.7,
        "max_output_tokens": 1000,
    }
)

# Print the response
print(response.text)`
      }
      break

    case "javascript":
      if (provider === "OpenAI") {
        return `import OpenAI from 'openai';

// Initialize the client
const openai = new OpenAI({
  apiKey: 'your_api_key' // Replace with your API key or use environment variable
});

// System prompt (optimized for ${modelName})
const systemPrompt = \`${prompt}\`;

async function generateResponse() {
  try {
    const response = await openai.chat.completions.create({
      model: '${model}',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Your first task is to...' }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateResponse();`
      } else if (provider === "Anthropic") {
        return `import Anthropic from '@anthropic-ai/sdk';

// Initialize the client
const anthropic = new Anthropic({
  apiKey: 'your_api_key' // Replace with your API key or use environment variable
});

// System prompt (optimized for ${modelName})
const systemPrompt = \`${prompt}\`;

async function generateResponse() {
  try {
    const response = await anthropic.messages.create({
      model: '${model}',
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Your first task is to...' }
      ],
      max_tokens: 1000
    });

    console.log(response.content[0].text);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateResponse();`
      }
      break

    case "typescript":
      if (provider === "OpenAI") {
        return `import OpenAI from 'openai';

// Initialize the client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use environment variable
});

// System prompt (optimized for ${modelName})
const systemPrompt: string = \`${prompt}\`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function generateResponse(userMessage: string): Promise<string | null> {
  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: '${model}',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error generating response:', error);
    return null;
  }
}

// Example usage
generateResponse('Your first task is to...').then((result) => {
  if (result) {
    console.log(result);
  }
});`
      } else if (provider === "Anthropic") {
        return `import Anthropic from '@anthropic-ai/sdk';

// Initialize the client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY // Use environment variable
});

// System prompt (optimized for ${modelName})
const systemPrompt: string = \`${prompt}\`;

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function generateResponse(userMessage: string): Promise<string | null> {
  try {
    const messages: AnthropicMessage[] = [
      { role: 'user', content: userMessage }
    ];

    const response = await anthropic.messages.create({
      model: '${model}',
      system: systemPrompt,
      messages,
      max_tokens: 1000
    });

    return response.content[0]?.text || null;
  } catch (error) {
    console.error('Error generating response:', error);
    return null;
  }
}

// Example usage
generateResponse('Your first task is to...').then((result) => {
  if (result) {
    console.log(result);
  }
});`
      }
      break

    case "go":
      if (provider === "OpenAI") {
        return `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type OpenAIRequest struct {
	Model       string    \`json:"model"\`
	Messages    []Message \`json:"messages"\`
	MaxTokens   int       \`json:"max_tokens"\`
	Temperature float64   \`json:"temperature"\`
}

type Message struct {
	Role    string \`json:"role"\`
	Content string \`json:"content"\`
}

type OpenAIResponse struct {
	Choices []struct {
		Message Message \`json:"message"\`
	} \`json:"choices"\`
}

func main() {
	// System prompt (optimized for ${modelName})
	systemPrompt := \`${prompt}\`

	// Prepare the request
	request := OpenAIRequest{
		Model: "${model}",
		Messages: []Message{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: "Your first task is to..."},
		},
		MaxTokens:   1000,
		Temperature: 0.7,
	}

	// Convert to JSON
	jsonData, err := json.Marshal(request)
	if err != nil {
		fmt.Printf("Error marshalling JSON: %v\\n", err)
		return
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Error creating request: %v\\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+os.Getenv("OPENAI_API_KEY"))

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\\n", err)
		return
	}

	// Parse response
	var openaiResp OpenAIResponse
	err = json.Unmarshal(body, &openaiResp)
	if err != nil {
		fmt.Printf("Error unmarshalling response: %v\\n", err)
		return
	}

	// Print the result
	if len(openaiResp.Choices) > 0 {
		fmt.Println(openaiResp.Choices[0].Message.Content)
	}
}`
      } else if (provider === "Anthropic") {
        return `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type AnthropicRequest struct {
	Model     string    \`json:"model"\`
	System    string    \`json:"system"\`
	Messages  []Message \`json:"messages"\`
	MaxTokens int       \`json:"max_tokens"\`
}

type Message struct {
	Role    string \`json:"role"\`
	Content string \`json:"content"\`
}

type AnthropicResponse struct {
	Content []struct {
		Text string \`json:"text"\`
	} \`json:"content"\`
}

func main() {
	// System prompt (optimized for ${modelName})
	systemPrompt := \`${prompt}\`

	// Prepare the request
	request := AnthropicRequest{
		Model:  "${model}",
		System: systemPrompt,
		Messages: []Message{
			{Role: "user", Content: "Your first task is to..."},
		},
		MaxTokens: 1000,
	}

	// Convert to JSON
	jsonData, err := json.Marshal(request)
	if err != nil {
		fmt.Printf("Error marshalling JSON: %v\\n", err)
		return
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", "https://api.anthropic.com/v1/messages", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Error creating request: %v\\n", err)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", os.Getenv("ANTHROPIC_API_KEY"))
	req.Header.Set("anthropic-version", "2023-06-01")

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\\n", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\\n", err)
		return
	}

	// Parse response
	var anthropicResp AnthropicResponse
	err = json.Unmarshal(body, &anthropicResp)
	if err != nil {
		fmt.Printf("Error unmarshalling response: %v\\n", err)
		return
	}

	// Print the result
	if len(anthropicResp.Content) > 0 {
		fmt.Println(anthropicResp.Content[0].Text)
	}
}`
      }
      break

    default:
      return prompt
  }

  return prompt
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast({
    description: "Copied to clipboard",
    className: "font-mono",
  })
}

export const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
