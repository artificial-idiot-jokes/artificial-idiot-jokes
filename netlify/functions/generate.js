exports.handler = async function(event, context) {
  const jokes = [
    "Why don’t skeletons fight each other? They don’t have the guts.",
    "I told my computer I needed a break, and it said: 'No problem, I’ll go to sleep.'",
    "Why did the AI cross the road? It was trained on 10,000 chickens doing it.",
    "Parallel lines have so much in common… it’s a shame they’ll never meet.",
    "Why did the coffee file a police report? It got mugged."
  ];

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

  return {
    statusCode: 200,
    body: JSON.stringify({ joke: randomJoke })
  };
};
