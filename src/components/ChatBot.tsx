import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Paperclip, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

// Interface para definir a estrutura de uma mensagem no chat
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBotProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChatBot({ isOpen: externalIsOpen, onOpenChange }: ChatBotProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá, sou Nina, assistente virtual, que irá te ajudar nessa jornada, pode digitar qual a sua dúvida que irei te responder. :)",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Botão do Chat */}
      {!isOpen && (
        <button
          onClick={() => handleOpenChange(true)}
          className="fixed bottom-8 right-8 w-20 h-20 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50"
          style={{ background: '#F86999' }}
        >
          <Bot size={40} className="text-white" />
        </button>
      )}

      {/* Janela do Chat */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-[90vw] max-w-[450px] h-[80vh] max-h-[550px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col animate-fade-in">
          {/* Cabeçalho */}
          <div style={{ background: 'linear-gradient(to right, hsl(315, 26%, 40%), hsl(320, 30%, 50%))' }} className="rounded-t-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F86999' }}>
                <Bot size={32} className="text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-semibold text-lg">Nina</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white/80">Assistente Virtual</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleOpenChange(false)}
              className="text-white hover:bg-white/10 rounded-lg p-2 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mensagens */}
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
                    message.role === "user" ? "bg-blue-400" : ""
                  }`}
                  style={message.role === "assistant" ? { background: '#F86999' } : {}}
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
                  <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({children}) => <strong className="font-bold">{children}</strong>,
                        em: ({children}) => <em className="italic">{children}</em>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                        li: ({children}) => <li className="mb-1">{children}</li>,
                        code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F86999' }}>
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

          {/* Campo de Entrada */}
          <div className="p-4 border-t bg-white rounded-b-3xl">
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img src={selectedImage} alt="Preview" className="max-h-32 rounded-lg" />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                className="rounded-full w-12 h-12 p-0 hover:bg-gray-100"
                disabled={isLoading}
              >
                <Paperclip size={20} className="text-gray-600" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escreva aqui..."
                className="flex-1 bg-green-100 border-green-300 rounded-full px-6 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-green-300"
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
