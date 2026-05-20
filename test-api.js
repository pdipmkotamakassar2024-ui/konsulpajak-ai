// Test sending a message in the UIMessage format (parts-based) that SDK v6 useChat sends
async function test() {
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{
        id: "test-1",
        role: "user",
        parts: [{ type: "text", text: "Apa itu pajak?" }]
      }]
    })
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:");
  console.log(text.substring(0, 500));
}
test();
