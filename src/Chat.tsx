import { OpenAI } from "openai"
import { useState } from "react"

export function Chat() {
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [response, setResponse] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(",")[1] // Remove metadata
      setImageBase64(base64String || null)
    }
    reader.readAsDataURL(file) // Convert image to Base64
  }

  const sendToOpenAI = async () => {
    if (!imageBase64) return
    setLoading(true)

    try {
      const client = new OpenAI({
        apiKey:
          "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", // Keep secure in .env file
        dangerouslyAllowBrowser: true,
      })

      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "There is a single a single circle on one of the 5 lines. which line has the circle?",
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }, // Base64 image
              },
            ],
          },
        ],
      })

      completion.choices[0].message.content &&
        setResponse(completion.choices[0].message.content)
    } catch (error) {
      console.error("Error:", error)
      setResponse("Error processing image.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={sendToOpenAI} disabled={!imageBase64 || loading}>
        {loading ? "Processing..." : "Send"}
      </button>
      <p>Response: {response}</p>
    </div>
  )
}
