import { useEffect, useRef, useState } from "react";
import { useAgents } from "@/hooks/useAgents";
import { ChatMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  projectId: number;
}

export default function ChatInterface({ projectId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { processUserMessage } = useAgents(projectId);
  const { toast } = useToast();

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/chat`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      }
    };

    if (projectId) {
      fetchMessages();
    }
  }, [projectId, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle message send
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: Date.now(), // Temporary ID
        projectId,
        sender: "user",
        content: message,
        timestamp: new Date(),
        metadata: null
      };
      
      // Save user message to database
      await apiRequest("POST", "/api/chat", {
        projectId,
        sender: "user",
        content: message
      });
      
      // Update local state immediately for better UX
      setMessages(prev => [...prev, userMessage]);
      setMessage("");
      
      // Process message and get AI response
      const aiResponses = await processUserMessage(message);
      
      // Add AI responses to the chat
      for (const response of aiResponses) {
        await apiRequest("POST", "/api/chat", {
          projectId,
          sender: response.sender,
          content: response.content,
          metadata: response.metadata
        });
      }
      
      // Refresh messages
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/chat`] });
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the right styling for a message
  const getMessageStyle = (message: ChatMessage) => {
    if (message.sender === "user") {
      return {
        containerClass: "flex justify-end",
        messageClass: "bg-primary text-white rounded-lg p-3 max-w-xl"
      };
    }
    
    return {
      containerClass: "",
      messageClass: "bg-white rounded-lg p-3 max-w-3xl shadow-sm border border-gray-100"
    };
  };

  // Get agent icon based on agent name
  const getAgentIcon = (agentName: string) => {
    switch (agentName) {
      case "Project Manager":
        return "bg-green-100 text-green-800";
      case "Scrum Master":
        return "bg-purple-100 text-purple-800";
      case "Developer Agent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 h-full">
      {/* Enhanced message container with increased height and better scroll indication */}
      <div 
        ref={chatContainerRef}
        className="chat-container flex-1 overflow-y-auto p-4 space-y-4 pb-16"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent' 
        }}
      >
        {/* System welcome message */}
        {messages.length === 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-gray-700 dark:text-gray-200">
              <span className="font-medium">AI Workspace:</span> You're now in Work mode. I have a team of AI agents ready to help you build your app. What would you like to work on today?
            </p>
          </div>
        )}
        
        {/* Chat messages - enlarged and with better styling */}
        {messages.map((msg) => {
          const { containerClass, messageClass } = getMessageStyle(msg);
          return (
            <div key={msg.id} className={containerClass}>
              <div className={`${messageClass} dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700`}>
                {msg.sender !== "user" && (
                  <div className="flex items-center mb-2">
                    <div className={`w-6 h-6 rounded-full ${getAgentIcon(msg.sender)} flex items-center justify-center text-xs mr-2`}>
                      <i className="fas fa-robot"></i>
                    </div>
                    <span className="font-medium">{msg.sender}</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
                
                {/* Render code snippets if present in metadata - improved style */}
                {msg.metadata && msg.metadata.codeSnippet && (
                  <div className="bg-gray-800 dark:bg-gray-900 text-green-400 p-3 rounded-md font-mono mt-3 overflow-x-auto max-h-96 overflow-y-auto">
                    <pre>{msg.metadata.codeSnippet}</pre>
                  </div>
                )}
                
                {/* Render task status updates if present in metadata */}
                {msg.metadata && msg.metadata.taskUpdate && (
                  <div className="mt-3 bg-blue-50 dark:bg-blue-900 p-3 rounded-md text-blue-800 dark:text-blue-200">
                    <i className="fas fa-info-circle mr-2"></i> {msg.metadata.taskUpdate}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Fixed Chat input area with improved Agent Settings button */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sticky bottom-0 left-0 right-0 shadow-md">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Type your message..."
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            ></textarea>
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <i className="fas fa-paperclip"></i>
              </button>
              <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <i className="fas fa-smile"></i>
              </button>
            </div>
          </div>
          <button 
            className="ml-3 bg-primary text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
          >
            <i className="fas fa-paper-plane mr-1"></i> Send
          </button>
        </div>
        
        {/* Bottom controls that serve as the main area for agent interaction modes */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <button className="mr-4 hover:text-primary dark:hover:text-blue-400 flex items-center">
              <i className="fas fa-microphone mr-1"></i> Voice
            </button>
            <button className="hover:text-primary dark:hover:text-blue-400 flex items-center">
              <i className="fas fa-code mr-1"></i> Code Mode
            </button>
          </div>
          
          {/* Agent Settings button for configuration */}
          <button 
            className="flex items-center bg-indigo-50 dark:bg-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-md text-sm font-medium"
            onClick={() => {
              if (typeof window !== 'undefined') {
                // Dispatch a custom event to notify parent component
                const event = new CustomEvent('openAgentSettings', { detail: { projectId } });
                window.dispatchEvent(event);
              }
            }}
          >
            <i className="fas fa-robot mr-2"></i>
            Agent Settings
          </button>
        </div>
      </div>
    </div>
  );
}
