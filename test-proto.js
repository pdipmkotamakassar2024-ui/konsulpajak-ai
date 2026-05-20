import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

async function test() {
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: [{ role: 'user', content: 'hi' }]
  });
  console.log("Methods on prototype:");
  const proto = Object.getPrototypeOf(result);
  console.log(Object.getOwnPropertyNames(proto));
}
test();
