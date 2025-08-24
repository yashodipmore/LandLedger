'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  RefreshCw,
  HelpCircle,
  BookOpen,
  Shield,
  MapPin,
  FileText,
  ChevronDown,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { knowledgeBase, ChatContext } from '@/services/chatbot-knowledge';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  category?: string;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  action: string;
  category: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [chatContext, setChatContext] = useState<ChatContext>({
    previousQuestions: [],
    userPreferences: {
      language: 'en',
      detailLevel: 'intermediate'
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Platform Navigation",
      description: "How to use LandLedger platform",
      action: "How do I navigate the LandLedger platform?",
      category: "navigation"
    },
    {
      icon: <User className="w-4 h-4" />,
      label: "Registration Guide",
      description: "How to create account and register",
      action: "How do I register on LandLedger?",
      category: "registration"
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: "Property Search",
      description: "Find and verify properties easily",
      action: "How do I search for properties?",
      category: "search"
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Transfer Property",
      description: "Complete property transfer guide",
      action: "How do I transfer property ownership?",
      category: "transfer"
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "User Roles",
      description: "What can different users do?",
      action: "What can different users do on the platform?",
      category: "roles"
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: "Platform Features",
      description: "All LandLedger capabilities",
      action: "What are the main features of LandLedger?",
      category: "features"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect current page for context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      let currentPage = 'home';
      
      if (path.includes('/citizen')) currentPage = 'citizen';
      else if (path.includes('/dashboard')) currentPage = 'dashboard';
      else if (path.includes('/owner')) currentPage = 'owner';
      else if (path.includes('/official')) currentPage = 'official';
      
      setChatContext(prev => ({ ...prev, currentPage }));
    }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Enhanced welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "👋 **Welcome to LandLedger Platform Guide!**\n\nI'm your personal assistant to help you navigate and use the LandLedger platform effectively! \n\n🎯 **I can help you with:**\n� Platform navigation and features\n📝 Registration and account setup\n🔍 Property search and verification\n📋 Property transfer process\n👥 Understanding user roles\n�️ Troubleshooting and support\n\n**New to the platform? I'll guide you step by step!**",
        timestamp: new Date(),
        suggestions: ["How to navigate platform?", "How to register?", "How to search property?"],
        category: 'welcome'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const getBotResponse = (userInput: string): Message => {
    // Update chat context
    const updatedContext = {
      ...chatContext,
      previousQuestions: [...chatContext.previousQuestions, userInput].slice(-5) // Keep last 5 questions
    };
    setChatContext(updatedContext);

    // Get response from knowledge base
    const response = knowledgeBase.findRelevantAnswer(userInput, updatedContext);
    const suggestions = knowledgeBase.getSuggestions(userInput, updatedContext);

    // Determine category for enhanced UI
    let category = 'general';
    if (userInput.toLowerCase().includes('navigation') || userInput.toLowerCase().includes('how to use')) {
      category = 'navigation';
    } else if (userInput.toLowerCase().includes('register') || userInput.toLowerCase().includes('sign up')) {
      category = 'registration';
    } else if (userInput.toLowerCase().includes('search') || userInput.toLowerCase().includes('property')) {
      category = 'search';
    } else if (userInput.toLowerCase().includes('transfer') || userInput.toLowerCase().includes('ownership')) {
      category = 'transfer';
    } else if (userInput.toLowerCase().includes('role') || userInput.toLowerCase().includes('user')) {
      category = 'roles';
    } else if (userInput.toLowerCase().includes('feature') || userInput.toLowerCase().includes('capability')) {
      category = 'features';
    }

    return {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions,
      category
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickActions(false);
    setIsTyping(true);

    // Simulate realistic typing delay with dynamic timing
    const typingDelay = 800 + (text.length * 10) + Math.random() * 1000;
    
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const clearChat = () => {
    setMessages([]);
    setShowQuickActions(true);
    setChatContext({
      previousQuestions: [],
      userPreferences: {
        language: 'en',
        detailLevel: 'intermediate'
      }
    });
    
    // Add fresh welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "🔄 **Fresh Start!**\n\nChat history cleared. I'm ready to help you navigate LandLedger platform again!\n\n✨ **What would you like to learn about?**\n📱 Platform features\n📝 Registration process\n🔍 Property search\n📋 Transfer procedures",
        timestamp: new Date(),
        suggestions: ["Platform navigation", "How to register", "Search properties"],
        category: 'welcome'
      };
      setMessages([welcomeMessage]);
    }, 500);
  };

  // Get category-specific styling
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'navigation': return 'from-blue-500 to-cyan-500';
      case 'registration': return 'from-green-500 to-teal-500';
      case 'search': return 'from-purple-500 to-pink-500';
      case 'transfer': return 'from-orange-500 to-red-500';
      case 'roles': return 'from-indigo-500 to-purple-500';
      case 'features': return 'from-yellow-500 to-orange-500';
      case 'support': return 'from-gray-500 to-slate-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: isMinimized ? 0.3 : 1,
              height: isMinimized ? 60 : 600
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
              </div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <motion.div 
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-1">
                    LandLedger Guide
                    <Zap className="w-3 h-3" />
                  </h3>
                  <p className="text-blue-100 text-xs">Platform Navigation Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 relative z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 w-8 h-8 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-white hover:bg-white/20 w-8 h-8 p-0"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <ScrollArea className="h-96 p-4">
                  {/* Quick Actions */}
                  {showQuickActions && messages.length <= 1 && (
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-semibold text-gray-700">Quick Actions</p>
                        <Badge variant="secondary" className="text-xs">Smart Suggestions</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleQuickAction(action.action)}
                            className="flex flex-col items-start space-y-2 p-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-200 text-left group border border-gray-200 hover:border-blue-200"
                          >
                            <div className={`text-white p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(action.category)} group-hover:scale-110 transition-transform`}>
                              {action.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{action.label}</p>
                              <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">{action.description}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Messages */}
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <motion.div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === 'user' 
                                ? 'bg-blue-600' 
                                : `bg-gradient-to-r ${getCategoryColor(message.category)}`
                            }`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {message.type === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Brain className="w-4 h-4 text-white" />
                            )}
                          </motion.div>
                          <div className={`rounded-2xl px-4 py-2 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="text-sm whitespace-pre-line">{message.content}</div>
                            <div className={`text-xs mt-1 ${
                              message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex space-x-2 max-w-[85%]">
                          <motion.div 
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Brain className="w-4 h-4 text-white" />
                          </motion.div>
                          <div className="bg-gray-100 rounded-2xl px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500 mr-2">AI is thinking</span>
                              <div className="flex space-x-1">
                                <motion.div 
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                />
                                <motion.div 
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div 
                                  className="w-2 h-2 bg-blue-400 rounded-full"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Suggestions */}
                    {messages.length > 0 && messages[messages.length - 1].suggestions && !isTyping && (
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Related questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSendMessage(suggestion)}
                              className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 px-3 py-2 rounded-full transition-all duration-200 border border-blue-200 hover:border-blue-300 font-medium"
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                      placeholder="Ask about platform features, registration, property search..."
                      className="flex-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                    <Zap className="w-3 h-3 mr-1" />
                    <span>Powered by LandLedger • Platform Navigation Assistant</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
