'use client'

import { useChat } from 'ai/react'
import styles from "./page.module.css"


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

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
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            className={styles.input}
          />
        </form>
      </div>
    </div>
  )
}
