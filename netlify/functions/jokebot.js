exports.handler = async (event, context) => {
  const jokes = [
    "Why don’t skeletons ever go trick or treating? Because they have no body to go with!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "I’m reading a book about anti-gravity. It’s impossible to put down!",
    "Why don’t programmers like nature? Too many bugs."
  ];

  const riddles = [
    "What has keys but can’t open locks? A piano.",
    "The more of me you take, the more you leave behind. What am I? Footsteps.",
    "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? An echo."
  ];

  const { type } = event.queryStringParameters || {};
  let responseText = "";

  if (type === "riddle") {
    responseText = riddles[Math.floor(Math.random() * riddles.length)];
  } else {
    responseText = jokes[Math.floor(Math.random() * jokes.length)];
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ text: responseText })
  };
};
