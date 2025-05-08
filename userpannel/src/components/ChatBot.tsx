import { useState } from "react";
import { MessageSquareText, X } from "lucide-react";

const staticAnswers: Record<string, string> = {
  "Tell me about Jalumuru Hill.": "Jalumuru Hill is a peaceful spiritual place in Srikakulam, known for its beautiful temple and nature.",
  "How can I become a donor?": "Go to the ContactUs page where You can donate money or support temple activities.",
  "When is the next event happening?": "Check the Events page on the website to see the latest events and dates.",
  "Can I download eBooks from here?": "Yes, you can visit the eBooks page and download free spiritual books anytime.",
  "How do I reach the temple?": "Jalumuru Hill is near Narasannapeta in Srikakulam. You can reach it by road or train { tilaru station }.",
  "What is the history of Jalumuru Hill?": "Jalumuru Hill is a holy place with old stories of saints and miracles. complete story in ebooks page ",
  "Are there any special rituals performed daily?": "Yes, daily pujas, abhishekam, and aartis are done in the morning and evening.",
  "How can I contact the temple authorities?": "Visit the Contact page to find phone numbers, email .",
  "Is there any accommodation near Jalumuru Hill?": "No, currently there is no guest houses and lodges near the temple.",
  "How do I volunteer for temple services?": "You can join as a volunteer by contacting us on Contact page.",
  "Are there photos or videos of past events?": "Yes, go to the social media icons to view photos and videos from past events.",
  "Can I donate online through the website?": "Yes, you can donate safely online by contacting us on our website.",
  "What kind of eBooks are available here?": "You can find spiritual and religious books related to Jalumuru Hill and temple rituals.",
  "How do I submit a request or prayer?": "Use the Contact page to submit prayer requests or feedback.",
  "What are the temple timings and dress code?": "The temple is open from 6 AM to 8 PM. Traditional attire is recommended.",
};

const predefinedQuestions = Object.keys(staticAnswers);

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  const handleQuestionClick = (question: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question },
      { sender: "bot", text: staticAnswers[question] },
    ]);
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 p-4 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg z-50"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <MessageSquareText size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 max-h-[80vh] bg-white border rounded-2xl shadow-2xl p-4 flex flex-col z-50">
          <div className="text-lg font-semibold mb-2">Ask me something:</div>

          <div className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto">
            {predefinedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleQuestionClick(q)}
                className="bg-yellow-100 hover:bg-yellow-200 text-sm px-3 py-2 rounded-xl text-left"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto border-t pt-2 text-sm mb-2 max-h-48">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left text-gray-700"}`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-xl ${
                    msg.sender === "user" ? "bg-yellow-200" : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
