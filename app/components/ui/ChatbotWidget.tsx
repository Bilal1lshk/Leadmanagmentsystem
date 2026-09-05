"use client";

import { useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import axios from "axios";

type ChatMessage = {
    role: "user" | "bot";
    text: string;
};

type AIResponse = {
    success: boolean;
    response: string;
};

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "bot",
            text: "Hi! I’m your AI assistant. Ask me anything about LeadWise.",
        },
    ]);

    const handleSubmit = async () => {
        const trimmed = input.trim();

        if (!trimmed || loading) return;

        const userMessage: ChatMessage = {
            role: "user",
            text: trimmed,
        };

        setMessages((prev) => [...prev, userMessage]);

        setInput("");
        setLoading(true);

        try {
            const response = await axios.post<AIResponse>(
                "https://chatbot-livid-gamma-59.vercel.app/ai/chat",
                {
                    message: trimmed,
                }
            );

            const botReply = response.data.response;
            console.log("AI response:", botReply);

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: botReply,
                },
            ]);
        } catch (error: unknown) {
            console.error("AI chat failed:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: "Sorry, I couldn’t reach the AI service. Please try again later.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">

            {isOpen ? (
                <div className="w-90 overflow-hidden rounded-2xl border border-[#E5CB90]/80 bg-white shadow-[0_18px_55px_rgba(17,24,39,0.16)]">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-[#22303A] px-4 py-3 text-white">

                        <div className="flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFCC70] text-[#22303A]">
                                <Bot className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    AI Assistant
                                </p>

                                <p className="text-[10px] text-slate-300">
                                    Online
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1.5 text-slate-200 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close chat"
                        >
                            <X className="h-4 w-4" />
                        </button>

                    </div>


                    {/* Chat Area */}
                    <div className="flex max-h-105 min-h-90 flex-col bg-[#FFF7E0]">

                        <div className="flex-1 space-y-3 overflow-y-auto p-4">

                            {messages.map((message, index) => (

                                <div
                                    key={`${message.role}-${index}`}
                                    className={`flex ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >

                                    <div
                                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                                            message.role === "user"
                                                ? "bg-[#22303A] text-white"
                                                : "bg-white text-[#22303A] ring-1 ring-[#E5CB90]/70"
                                        }`}
                                    >
                                        {message.text}
                                    </div>

                                </div>

                            ))}


                            {/* Loading */}
                            {loading && (

                                <div className="flex justify-start">

                                    <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-[#22303A] ring-1 ring-[#E5CB90]/70">

                                        <Sparkles className="h-3.5 w-3.5 animate-pulse text-[#458393]" />

                                        Thinking...

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* Input */}
                        <div className="border-t border-[#E5CB90]/70 bg-white p-3">

                            <div className="flex items-center gap-2 rounded-xl border border-[#E5CB90]/70 bg-[#FFFDF8] px-2.5 py-2">

                                <input
                                    value={input}
                                    onChange={(event) =>
                                        setInput(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            void handleSubmit();
                                        }
                                    }}
                                    placeholder="Ask the AI..."
                                    className="flex-1 border-0 bg-transparent text-sm text-[#22303A] outline-none placeholder:text-[#6B7280]"
                                />

                                <button
                                    type="button"
                                    onClick={() => void handleSubmit()}
                                    disabled={loading || !input.trim()}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22303A] text-white transition hover:bg-[#31485a] disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Send message"
                                >

                                    <Send className="h-4 w-4" />

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            ) : (

                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="group flex h-16 w-16 items-center justify-center rounded-full bg-[#22303A] text-white shadow-[0_18px_40px_rgba(34,48,58,0.25)] transition duration-200 hover:scale-105 hover:bg-[#2d4353]"
                    aria-label="Open AI chat"
                >

                    <MessageCircle className="h-7 w-7 transition group-hover:scale-110" />

                </button>

            )}

        </div>
    );
}