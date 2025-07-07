import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, User, Bot, Phone, Mail } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot" | "system";
  content: string;
  timestamp: Date;
}

const autoResponses = {
  "hello": "Hello! I'm here to help you with any questions about QuotexWallet. How can I assist you today?",
  "hi": "Hi there! Welcome to QuotexWallet support. What can I help you with?",
  "help": "I'd be happy to help! Here are some common topics:\n• Account setup and verification\n• Trading and wallet questions\n• Security and two-factor authentication\n• Deposits and withdrawals\n• Technical issues\n\nWhat specific area would you like help with?",
  "account": "For account-related questions, I can help with:\n• Creating your account\n• Verifying your identity\n• Password reset\n• Account security\n\nWhat specific account issue are you experiencing?",
  "trading": "I can help with trading questions:\n• How to buy/sell cryptocurrencies\n• Understanding trading fees\n• P2P trading safety\n• Market analysis tools\n\nWhat would you like to know about trading?",
  "wallet": "For wallet support:\n• Setting up your wallet\n• Deposit and withdrawal procedures\n• Transaction history\n• Wallet security\n\nWhat wallet question can I help with?",
  "security": "Security is our top priority! I can help with:\n• Two-factor authentication setup\n• Account security best practices\n• Suspicious activity reporting\n• Password security\n\nWhat security topic interests you?",
  "fees": "Our fee structure is transparent:\n• Trading fees: 0.25% per transaction\n• Deposit fees: Free for most cryptocurrencies\n• Withdrawal fees: Network-dependent\n• P2P trading: 0.5% escrow fee\n\nWould you like details about any specific fees?",
  "deposit": "To deposit funds:\n1. Log into your account\n2. Go to 'Wallet' section\n3. Select 'Deposit'\n4. Choose your cryptocurrency\n5. Copy the wallet address\n6. Send funds from your external wallet\n\nNeed help with a specific deposit?",
  "withdrawal": "To withdraw funds:\n1. Navigate to 'Wallet' section\n2. Select 'Withdraw'\n3. Choose cryptocurrency and amount\n4. Enter destination wallet address\n5. Confirm with 2FA if enabled\n\nIs there a specific withdrawal issue?",
  "p2p": "P2P trading allows direct cryptocurrency exchange with other users:\n• Built-in escrow protection\n• Multiple payment methods\n• Verified trader ratings\n• Secure messaging system\n\nWhat would you like to know about P2P trading?",
  "2fa": "Two-factor authentication adds extra security:\n1. Go to Account Settings\n2. Select 'Security'\n3. Enable 2FA\n4. Scan QR code with authenticator app\n5. Enter verification code\n\nNeed help setting up 2FA?",
  "support": "You can reach our support team:\n📧 Email: support.quotex@quotexes.online\n📞 Phone: (672) 380-5729\n⏰ Available 24/7\n\nWould you like me to connect you with a human agent?",
  "agent": "I'd be happy to connect you with a human agent! Please provide:\n• Your email address\n• Your phone number (optional)\n• Brief description of your issue\n\nAn agent will contact you within 2 hours during business hours.",
  "phone": "Our phone support is available 24/7:\n📞 (672) 380-5729\n\nYou can also reach us via:\n📧 support.quotex@quotexes.online\n\nWould you prefer to speak with an agent now?",
  "email": "You can email us at: support.quotex@quotexes.online\n\nWe typically respond within 2 hours during business hours and 24 hours on weekends.\n\nWould you like me to help you with anything else?",
  "default": "I understand you need help with that. Let me connect you with one of our specialists who can provide detailed assistance.\n\nPlease provide your email address and I'll have an agent reach out to you within 2 hours."
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm your QuotexWallet support assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [agentForm, setAgentForm] = useState({ email: "", phone: "", issue: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAutoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact keyword matches first
    for (const [key, response] of Object.entries(autoResponses)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return response;
      }
    }
    
    // Check for common question patterns
    if (lowerMessage.includes("how") || lowerMessage.includes("what") || lowerMessage.includes("where")) {
      return "I'd be happy to help answer your question! For detailed assistance, let me connect you with one of our specialists.\n\nPlease provide your email address and I'll have an agent reach out to you.";
    }
    
    return autoResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getAutoResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Check if user wants to speak to an agent
      if (inputValue.toLowerCase().includes("agent") || inputValue.toLowerCase().includes("human")) {
        setShowAgentForm(true);
      }
    }, 1000);
  };

  const handleAgentRequest = () => {
    if (!agentForm.email) return;

    const systemMessage: Message = {
      id: Date.now().toString(),
      type: "system",
      content: `Thank you! I've submitted your request to our support team. An agent will contact you at ${agentForm.email}${agentForm.phone ? ` or ${agentForm.phone}` : ''} within 2 hours during business hours.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, systemMessage]);
    setShowAgentForm(false);
    setAgentForm({ email: "", phone: "", issue: "" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">QuotexWallet Support</h3>
                <p className="text-sm text-white/80">We're here to help 24/7</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-purple-600 text-white"
                      : message.type === "system"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === "bot" && (
                      <Bot className="h-4 w-4 mt-0.5 text-purple-600" />
                    )}
                    {message.type === "user" && (
                      <User className="h-4 w-4 mt-0.5 text-white" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === "user" ? "text-white/70" : "text-gray-500"
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Agent Form */}
          {showAgentForm && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Connect with an Agent</h4>
                <Input
                  placeholder="Your email address *"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  className="text-sm"
                />
                <Input
                  placeholder="Your phone number (optional)"
                  value={agentForm.phone}
                  onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  className="text-sm"
                />
                <Input
                  placeholder="Brief description of your issue"
                  value={agentForm.issue}
                  onChange={(e) => setAgentForm({ ...agentForm, issue: e.target.value })}
                  className="text-sm"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAgentRequest}
                    disabled={!agentForm.email}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm"
                  >
                    Request Agent
                  </Button>
                  <Button
                    onClick={() => setShowAgentForm(false)}
                    variant="outline"
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("I need help with my account")}
                className="text-xs"
              >
                Account Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("How do I trade?")}
                className="text-xs"
              >
                Trading Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputValue("I want to speak to an agent")}
                className="text-xs"
              >
                <Phone className="h-3 w-3 mr-1" />
                Agent
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}