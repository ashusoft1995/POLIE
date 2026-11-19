"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const quickReplies = [
  "How do I file a case?",
  "Check case status",
  "Officer directory",
  "Help with reports",
  "Contact support",
];

const botResponses: Record<string, string> = {
  "how do i file a case": "To file a case, go to the Cases page from your dashboard sidebar and click 'File New Case'. Fill in all required details including crime type, location, and description.",
  "check case status": "You can check case status by visiting the Cases page. Use the search bar to find your case by tracking ID or title. Each case shows its current status badge.",
  "officer directory": "The officer directory is available in the Officers page. You can search by name, badge number, or department. Contact information is displayed for each officer.",
  "help with reports": "Reports can be generated from the Reports page. Select the report type, date range, and click 'Generate'. You can download reports in PDF format.",
  "contact support": "For technical support, email hossannapolice@gmail.com or call our office at +251 46 775 0000 during working hours (Mon-Fri 8:00-17:00). For emergencies, dial 911.",
  default: "I'm here to help! You can ask me about filing cases, checking statuses, finding officers, generating reports, or general system help. What would you like to know?",
};

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message after component mounts
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: "Hello! I'm your Hossana Police assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      const lowerText = messageText.toLowerCase();
      let botText = botResponses.default;

      // Find matching response
      for (const [key, value] of Object.entries(botResponses)) {
        if (lowerText.includes(key)) {
          botText = value;
          break;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      {/* Floating chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] text-white shadow-lg flex items-center justify-center z-50 hover:shadow-green-500/40 transition-shadow"
            aria-label="Open chat assistant"
          >
            <MessageCircle size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold border border-white dark:border-[#0F172A]">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "500px",
            }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-4 right-4 w-full max-w-sm bg-white dark:bg-[#1E293B] rounded-xl shadow-xl z-50 flex flex-col overflow-hidden border border-[var(--border)]"
            style={{ maxHeight: isMinimized ? "50px" : "500px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs">Police Assistant</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                    <p className="text-green-100 text-[10px]">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 rounded-md bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-md bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[var(--surface2)]">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 ${
                        msg.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                          msg.sender === "bot"
                            ? "bg-[var(--green)] text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {msg.sender === "bot" ? <Bot size={14} /> : <User size={14} />}
                      </div>
                      <div
                        className={`flex-1 ${
                          msg.sender === "user" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`inline-block px-3 py-2 rounded-xl text-xs ${
                            msg.sender === "bot"
                              ? "bg-white dark:bg-[#0F172A] text-[var(--charcoal)] dark:text-slate-200"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <p className="text-[9px] text-[var(--muted)] mt-0.5">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-md bg-[var(--green)] text-white flex items-center justify-center">
                        <Bot size={14} />
                      </div>
                      <div className="bg-white dark:bg-[#0F172A] px-3 py-2.5 rounded-xl">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-bounce" />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick replies */}
                <div className="px-3 py-2 bg-white dark:bg-[#1E293B] border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--slate)] mb-1.5 font-semibold">
                    Quick questions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickReplies.map((reply) => (
                      <motion.button
                        key={reply}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSend(reply)}
                        className="px-2.5 py-1 rounded-md bg-[var(--surface2)] hover:bg-[var(--green-light)] text-xs font-medium text-[var(--charcoal)] hover:text-[var(--green-dark)] border border-[var(--border)] transition-colors"
                      >
                        {reply}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Input area */}
                <div className="p-3 bg-white dark:bg-[#1E293B] border-t border-[var(--border)]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 input text-xs h-9"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!inputText.trim()}
                      className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
                    >
                      <Send size={14} />
                    </motion.button>
                  </form>
                  <p className="text-[8px] text-[var(--muted)] mt-1.5 text-center">
                    Powered by Hossana Police AI Assistant
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

