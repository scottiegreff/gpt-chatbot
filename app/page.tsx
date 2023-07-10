'use client'

import { useState } from 'react'
import { useChat, useCompletion } from 'ai/react'
import { useDebouncedCallback } from 'use-debounce'
import styles from "./page.module.css"


export default function Chat() {

  const [chatMessage, setChatMessage] = useState('')
  const { messages, input, setInput, handleSubmit, handleInputChange } = useChat()

  const { complete, completion } = useCompletion({
    api: '/api/completion',
    onResponse: res => {
      if (res.status === 429) {
        console.error('You are being rate limited. Please try again later.')
      }
    },
    onFinish: () => {
      console.log(completion)
      setInput(completion)
    }
  })
 
  const generateCompletion = useDebouncedCallback(e => {
    complete(chatMessage)
  }, 500)

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value)
    handleInputChange(e)
  }

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e)
    setChatMessage('')
  }

  return (
    <div className="chat">
      <h1 className={styles.chat_title}>Welcome to the AI Chatbot</h1>
      <div className={styles.message_content}>
        {messages.map((m) => (
          <div key={m.id}>
            <span>{m.role === 'user' ? '👤' : '🤖'}: </span>
            <span className={m.role === 'user' ? 'text-blue-400' : ''}>
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.text_area}>
        <form onSubmit={(e) => handleChatSubmit(e)}>
          <input
            value={input}
            placeholder="Say something..."
            onChange={(e) => handleChatInputChange(e)}
            className={styles.input}
          />
        </form>
        <button onClick={generateCompletion}>Generate completion</button>
      </div>
    </div>
  )
}
