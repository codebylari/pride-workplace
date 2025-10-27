import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá, sou Nina, assistente virtual, que irá te ajudar nessa jornada, pode digitar qual a sua dúvida que irei te responder. :)",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-assistant", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) throw error;

      if (data?.message) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50"
        >
          <Bot size={40} className="text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-[500px] h-[600px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-t-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center">
                <Bot size={32} className="text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-semibold text-lg">Nina</h3>
                <p className="text-sm text-white/80">Assistente Virtual</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 rounded-lg p-2 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant"
                      ? "bg-pink-300"
                      : "bg-blue-400"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot size={20} className="text-white" />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.role === "assistant"
                      ? "bg-white text-gray-800"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-pink-300 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-3xl">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escreva aqui..."
                className="flex-1 bg-green-100 border-green-300 rounded-full px-6"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-green-500 hover:bg-green-600 rounded-full w-12 h-12 p-0"
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
