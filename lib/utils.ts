export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export interface PrototypeData {
  companyName: string;
  slug: string;
  primaryColor: string;
  services: string;
  promptName: string;
}

export function generatePrototypeHTML(data: PrototypeData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.companyName} - Powered by Teleperson</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    #teleperson-chat-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: all 0.3s ease;
      z-index: 1000;
    }
    #teleperson-chat-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    #teleperson-chat-panel {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      display: none;
      flex-direction: column;
      z-index: 1000;
    }
    #teleperson-chat-panel.open {
      display: flex;
    }
    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chat-message {
      padding: 12px;
      border-radius: 8px;
      max-width: 80%;
      word-wrap: break-word;
    }
    .chat-message.user {
      background: #667eea;
      color: white;
      align-self: flex-end;
      margin-left: auto;
    }
    .chat-message.assistant {
      background: #f3f4f6;
      color: #1f2937;
      align-self: flex-start;
    }
    .chat-input-container {
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }
    .chat-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      outline: none;
    }
    .chat-input:focus {
      border-color: #667eea;
    }
    .send-button {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .send-button:hover {
      background: #5568d3;
    }
    .send-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    .powered-by {
      text-align: center;
      padding: 8px;
      font-size: 12px;
      color: #000000;
      border-top: 1px solid #e5e7eb;
    }
    .typing-indicator {
      display: none;
      padding: 12px;
      background: #f3f4f6;
      border-radius: 8px;
      max-width: 80%;
    }
    .typing-indicator.active {
      display: block;
    }
    .typing-indicator span {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      margin: 0 2px;
      animation: typing 1.4s infinite;
    }
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }
  </style>
</head>
<body class="bg-gray-50">
  <!-- Mock header with company brand -->
  <header style="background: ${data.primaryColor}" class="text-white p-6 shadow-md">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold">${data.companyName}</h1>
    </div>
  </header>

  <main class="max-w-6xl mx-auto p-8 mt-8">
    <h2 class="text-4xl font-bold mb-6 text-gray-800">Welcome to ${data.companyName}</h2>
    <p class="text-xl text-gray-600 mb-8">${data.services}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold mb-4 text-gray-800">About Our Services</h3>
        <p class="text-gray-600">We're dedicated to providing exceptional service and solutions. Try our AI assistant in the bottom right corner to learn more!</p>
      </div>
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h3 class="text-2xl font-semibold mb-4 text-gray-800">Get Started</h3>
        <p class="text-gray-600">Have questions? Our AI-powered assistant is here to help you 24/7. Click the chat button to start a conversation.</p>
      </div>
    </div>

    <div class="bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-lg">
      <h3 class="text-2xl font-bold mb-4 text-gray-800">Demo Preview</h3>
      <p class="text-gray-700 mb-4">This is a prototype demonstration powered by <strong>Teleperson</strong>. The chat widget in the bottom right corner uses AI to answer questions about ${data.companyName}.</p>
      <p class="text-gray-600 text-sm">Try asking about products, services, pricing, or general information!</p>
    </div>
  </main>

  <!-- TELEPERSON CHAT WIDGET -->
  <button id="teleperson-chat-button" aria-label="Open chat">
    💬
  </button>

  <div id="teleperson-chat-panel">
    <div class="chat-header">
      <div>
        <div class="font-semibold">${data.companyName}</div>
        <div class="text-xs opacity-90">AI Assistant</div>
      </div>
      <button id="close-chat" class="text-white text-2xl leading-none">&times;</button>
    </div>

    <div class="chat-messages" id="chat-messages">
      <div class="chat-message assistant">
        Hi! I'm here to help you learn about ${data.companyName}. What can I help you with today?
      </div>
      <div class="typing-indicator" id="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>

    <div class="chat-input-container">
      <input
        type="text"
        class="chat-input"
        id="chat-input"
        placeholder="Type your message..."
        autocomplete="off"
      />
      <button class="send-button" id="send-button">Send</button>
    </div>

    <div class="powered-by">
      Powered by <strong>Teleperson</strong>
    </div>
  </div>

  <script>
    const PROTOTYPE_ID = '${data.slug}';
    const PROMPT_NAME = '${data.promptName}';

    const chatButton = document.getElementById('teleperson-chat-button');
    const chatPanel = document.getElementById('teleperson-chat-panel');
    const closeButton = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');

    let conversationHistory = [];

    chatButton.addEventListener('click', () => {
      chatPanel.classList.add('open');
      chatInput.focus();
    });

    closeButton.addEventListener('click', () => {
      chatPanel.classList.remove('open');
    });

    async function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      // Add user message to UI
      addMessage(message, 'user');
      conversationHistory.push({ role: 'user', content: message });
      chatInput.value = '';

      // Disable input while processing
      chatInput.disabled = true;
      sendButton.disabled = true;
      typingIndicator.classList.add('active');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prototypeId: PROTOTYPE_ID,
            promptName: PROMPT_NAME,
            message: message,
            history: conversationHistory
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        addMessage(data.reply, 'assistant');
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } catch (error) {
        console.error('Chat error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
      } finally {
        typingIndicator.classList.remove('active');
        chatInput.disabled = false;
        sendButton.disabled = false;
        chatInput.focus();
      }
    }

    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = \`chat-message \${sender}\`;
      messageDiv.textContent = text;
      chatMessages.insertBefore(messageDiv, typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  </script>
</body>
</html>`;
}
