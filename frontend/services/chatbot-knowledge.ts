export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  relatedQuestions: string[];
}

export interface ChatContext {
  userRole?: 'citizen' | 'owner' | 'official';
  currentPage?: string;
  previousQuestions: string[];
  userPreferences: {
    language: string;
    detailLevel: 'basic' | 'intermediate' | 'advanced';
  };
}

export class ChatBotKnowledgeBase {
  private faqs: FAQItem[] = [
    // Platform Navigation
    {
      id: 'platform-navigation',
      question: 'How do I navigate the LandLedger platform?',
      answer: `🧭 **LandLedger Platform Navigation Guide:**

**🏠 Home Page**
• Platform overview and features
• Quick access to all portals
• Latest updates and announcements

**👥 Citizen Portal**
• Search any property in India
• Verify ownership details
• View property history
• Download property reports
• No registration required!

**� Owner Portal** (Registration Required)
• View your property portfolio
• Initiate property transfers
• Upload property documents
• Track transfer applications
• Update property information

**🏛️ Official Portal** (Government Access)
• Review transfer applications
• Verify documents
• Approve/reject transfers
• Manage land records

**� Dashboard**
• Real-time platform statistics
• Recent activities
• System performance metrics

**Quick Tip:** Start with Citizen Portal to explore without registration!`,
      category: 'navigation',
      keywords: ['navigation', 'how to use', 'platform guide', 'where to go'],
      relatedQuestions: ['How to register?', 'What can I do as citizen?', 'Where to search property?']
    },

    // Registration Process
    {
      id: 'registration-guide',
      question: 'How do I register on LandLedger?',
      answer: `� **Registration Process - Step by Step:**

**� For Property Owners:**

**Step 1: Go to Owner Portal**
• Click "Owner Portal" from home page
• Click "Register as Property Owner"

**Step 2: Basic Details**
• Full name (as per documents)
• Mobile number (OTP verification)
• Email address
• Create strong password

**Step 3: Identity Verification**
• Upload Aadhaar card (front & back)
• Upload PAN card
• Take selfie for verification

**Step 4: Property Documents**
• Upload property deed/sale deed
• Upload mutation documents
• Upload tax receipts
• Add property photos

**Step 5: Verification**
• Wait for government verification (3-7 days)
• Receive approval notification
• Start using all owner features

**👨‍💼 For Citizens:**
• No registration needed for basic search
• Optional registration for detailed reports

**⏱️ Timeline:** 3-7 working days for complete verification`,
      category: 'registration',
      keywords: ['register', 'sign up', 'create account', 'how to join'],
      relatedQuestions: ['What documents needed?', 'How long verification takes?', 'Verification status?']
    },

    // Property Search Guide
    {
      id: 'property-search-detailed',
      question: 'How do I search for properties?',
      answer: `🔍 **Complete Property Search Guide:**

**📍 Search Options Available:**

**1. Location-Based Search**
• Enter city, area, or pincode
• Use interactive map
• Browse by locality

**2. Property ID Search**
• Enter unique property ID
• Get instant results

**3. Owner Name Search**
• Search by current owner name
• Find all properties of owner

**4. Survey Number Search**
• Use government survey number
• Official land records

**🗺️ Using Interactive Map:**
• Zoom to your area of interest
• Click on property markers
• View property clusters
• Switch between satellite/street view

**📋 Search Results Show:**
• Property location and area
• Current owner details
• Property type and usage
• Legal status and clearances
• Recent transaction history
• Property valuation

**✅ Verification Features:**
• QR code scanning
• Document authenticity check
• Ownership verification
• Legal status confirmation

**💡 Pro Tips:**
• Use filters to narrow results
• Save favorite properties
• Download detailed reports
• Share property links`,
      category: 'search',
      keywords: ['search property', 'find property', 'property lookup', 'how to search'],
      relatedQuestions: ['How to verify property?', 'Property information available?', 'Download property report?']
    },

    // Property Transfer Process
    {
      id: 'transfer-process-guide',
      question: 'How do I transfer property ownership?',
      answer: `🔄 **Property Transfer Process - Complete Guide:**

**Phase 1: Initiate Transfer (Owner)**

**Step 1: Login to Owner Portal**
• Access your property dashboard
• Select property to transfer

**Step 2: Enter Buyer Details**
• Buyer's full name
• Contact information
• Identity documents

**Step 3: Upload Documents**
• Sale agreement draft
• NOC from society/authority
• Tax clearance certificates
• Identity proofs (both parties)

**Step 4: Submit Application**
• Review all details
• Pay application fees
• Submit for processing

**Phase 2: Government Review**

**Document Verification (2-3 days)**
• Legal compliance check
• Title verification
• Encumbrance clearance

**Field Verification (3-5 days)**
• Physical property inspection
• Boundary verification
• Neighbor confirmation

**Final Approval (1-2 days)**
• Complete review
• Decision notification

**Phase 3: Completion**
• Digital ownership transfer
• New certificates generated
• All parties notified
• Updated records available

**📊 Typical Timeline:** 7-15 working days
**💰 Fees:** ₹15,000 - ₹60,000 (vs traditional ₹50,000 - ₹2,00,000)`,
      category: 'transfer',
      keywords: ['transfer property', 'ownership change', 'property sale', 'transfer process'],
      relatedQuestions: ['Required documents?', 'Transfer fees?', 'Track application status?']
    },

    // User Roles Explained
    {
      id: 'user-roles-platform',
      question: 'What can different users do on the platform?',
      answer: `👥 **LandLedger User Roles & Capabilities:**

**�‍💼 Citizen (No Registration Required)**
• **Search Properties** - Find any property in India
• **Verify Ownership** - Check current owner details
• **View History** - See property transaction history
• **Download Reports** - Basic property information
• **QR Code Scan** - Instant property verification
• **Map Exploration** - Browse properties on map

**🏠 Property Owner (Registration Required)**
• **Portfolio Management** - View all owned properties
• **Transfer Initiation** - Start property sale process
• **Document Upload** - Add property documents
• **Application Tracking** - Monitor transfer status
• **Property Updates** - Modify property details
• **Valuation Reports** - Get property assessments
• **Notification Center** - Receive important updates

**🏛️ Government Official (Official Access)**
• **Application Review** - Process transfer requests
• **Document Verification** - Validate submitted documents
• **Field Inspection** - Conduct property verification
• **Approval Authority** - Approve/reject applications
• **Record Management** - Update official records
• **Dispute Resolution** - Handle property disputes

**🔐 Access Levels:**
• Citizen: Public access (no login needed)
• Owner: Verified access (documents required)
• Official: Government credentials required`,
      category: 'roles',
      keywords: ['user roles', 'what can I do', 'permissions', 'access levels'],
      relatedQuestions: ['How to become owner?', 'Citizen registration needed?', 'Official access process?']
    },

    // Platform Features
    {
      id: 'platform-features',
      question: 'What are the main features of LandLedger?',
      answer: `⭐ **LandLedger Platform Features:**

**🔍 Smart Property Search**
• Advanced search filters
• Interactive map interface
• Real-time property data
• Multiple search criteria
• Instant results

**✅ Property Verification**
• QR code scanning
• Digital certificates
• Ownership authentication
• Legal status check
• History verification

**📋 Digital Documentation**
• Document upload system
• Digital signatures
• Secure storage
• Easy sharing
• Version control

**🔄 Transfer Management**
• Online application system
• Status tracking
• Automated notifications
• Digital approvals
• Instant updates

**📊 Analytics Dashboard**
• Property statistics
• Market trends
• Transaction analytics
• Performance metrics
• Real-time data

**� Mobile Responsive**
• Works on all devices
• Mobile-friendly interface
• Touch-optimized
• Offline QR scanning
• App-like experience

**🔒 Security Features**
• Secure authentication
• Data encryption
• Privacy protection
• Audit trails
• Backup systems

**🌐 Accessibility**
• Multi-language support
• Simple interface
• Help documentation
• 24/7 availability
• Cross-browser compatibility`,
      category: 'features',
      keywords: ['features', 'what does it do', 'capabilities', 'platform functions'],
      relatedQuestions: ['How secure is platform?', 'Mobile app available?', 'Language support?']
    },

    // Troubleshooting
    {
      id: 'troubleshooting-guide',
      question: 'I am facing issues with the platform, how to get help?',
      answer: `🛠️ **LandLedger Support & Troubleshooting:**

**� Common Issues & Solutions:**

**Login Problems**
• Clear browser cache and cookies
• Try different browser
• Check internet connection
• Reset password if needed

**Document Upload Issues**
• Use supported formats (JPG, PNG, PDF)
• Check file size (max 10MB)
• Ensure clear, readable documents
• Try different browser

**Search Not Working**
• Check spelling of search terms
• Try different search criteria
• Use map search as alternative
• Refresh page and try again

**Slow Performance**
• Check internet speed
• Clear browser cache
• Close other browser tabs
• Try different device

**📞 Get Help:**

**24/7 Live Chat**
• Click chat icon (bottom-right)
• Instant assistance available
• Technical support included

**Phone Support**
• Call: +91-9876543210
• Hours: 9 AM - 9 PM IST
• Regional language support

**Email Support**
• Email: support@landledger.com
• Response within 4 hours
• Detailed issue resolution

**Help Center**
• Video tutorials available
• Step-by-step guides
• FAQ database
• User manual download

**� Training Resources**
• Free webinar sessions
• Interactive tutorials
• Practice environment
• Certification courses`,
      category: 'support',
      keywords: ['help', 'support', 'issues', 'problems', 'troubleshooting'],
      relatedQuestions: ['Contact support?', 'Training available?', 'Common problems?']
    }
  ];

  // Smart search algorithm
  findRelevantAnswer(query: string, context?: ChatContext): string {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Direct keyword matching
    for (const faq of this.faqs) {
      for (const keyword of faq.keywords) {
        if (normalizedQuery.includes(keyword.toLowerCase())) {
          return this.formatAnswer(faq, context);
        }
      }
    }

    // Fuzzy matching for questions
    for (const faq of this.faqs) {
      const questionWords = faq.question.toLowerCase().split(' ');
      const queryWords = normalizedQuery.split(' ');
      
      const matchScore = this.calculateMatchScore(questionWords, queryWords);
      if (matchScore > 0.6) {
        return this.formatAnswer(faq, context);
      }
    }

    // Context-based responses
    if (context?.currentPage) {
      return this.getContextualResponse(normalizedQuery, context);
    }

    // Default fallback
    return this.getDefaultResponse(normalizedQuery);
  }

  private calculateMatchScore(words1: string[], words2: string[]): number {
    let matches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1.includes(word2) || word2.includes(word1)) {
          matches++;
          break;
        }
      }
    }
    return matches / Math.max(words1.length, words2.length);
  }

  private formatAnswer(faq: FAQItem, context?: ChatContext): string {
    let answer = faq.answer;
    
    // Customize based on user role
    if (context?.userRole) {
      switch (context.userRole) {
        case 'citizen':
          answer += "\n\n💡 **As a citizen**, you have full access to property search and verification features without registration!";
          break;
        case 'owner':
          answer += "\n\n🏠 **As a property owner**, you can access advanced features like transfer initiation and portfolio management.";
          break;
        case 'official':
          answer += "\n\n🏛️ **As a government official**, you have administrative access to verify and approve transactions.";
          break;
      }
    }

    return answer;
  }

  private getContextualResponse(query: string, context: ChatContext): string {
    const page = context.currentPage;
    
    if (page === 'citizen' && query.includes('search')) {
      return "🔍 **You're on the Citizen Portal!** Perfect for property search. Use the search bar above to find properties by location, owner name, or property ID. You can also click on the interactive map to explore properties in specific areas.";
    }
    
    if (page === 'dashboard' && query.includes('statistics')) {
      return "📊 **Dashboard Analytics:** You can see real-time statistics including total properties registered, transfers completed, success rates, and platform activity. The charts update automatically with the latest data.";
    }
    
    return this.getDefaultResponse(query);
  }

  private getDefaultResponse(query: string): string {
    const responses = [
      "🤔 I'd love to help you with that! Could you be more specific about what you'd like to know regarding:",
      "💡 I'm here to assist! Let me help you understand more about:",
      "🔍 I can provide information on various topics. Would you like to know more about:"
    ];
    
    const topics = [
      "• **Platform Features** - How LandLedger works",
      "• **Blockchain Technology** - Security and transparency", 
      "• **Property Search** - Finding and verifying properties",
      "• **Transfer Process** - How to transfer property ownership",
      "• **User Roles** - Different types of users and their permissions",
      "• **Getting Started** - Registration and onboarding process"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse}\n\n${topics.join('\n')}\n\nTry asking about any of these topics or use the quick action buttons above!`;
  }

  // Get suggestions based on current conversation
  getSuggestions(query: string, context?: ChatContext): string[] {
    const suggestions = [
      "What is blockchain technology?",
      "How do I search for properties?",
      "What are the benefits of LandLedger?",
      "How does property transfer work?",
      "What documents do I need?",
      "Is the platform secure?",
      "How to get started?",
      "Who can use this platform?"
    ];

    // Randomize and return 3 suggestions
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  // Get FAQ by category for quick actions
  getFAQsByCategory(category: string): FAQItem[] {
    return this.faqs.filter(faq => faq.category === category);
  }
}

export const knowledgeBase = new ChatBotKnowledgeBase();
