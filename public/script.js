document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  // Store chat history to maintain conversation context
  let chatHistory = [];

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) {
      return;
    }

    // Display user message and clear input
    addMessage(userMessage, 'user-message');
    userInput.value = '';

    try {
      // Add user message to history for the model
      chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          // Send history for conversational context
          history: chatHistory.slice(0, -1) 
        }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      const botMessage = data.response;

      addMessage(botMessage, 'bot-message');

      // Add bot response to history
      chatHistory.push({ role: 'model', parts: [{ text: botMessage }] });
    } catch (error) {
      console.error('Error:', error);
      addMessage('Sorry, something went wrong. Please try again.', 'bot-message');
    }
  });

  function addMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  }
});