// promptiq.js

// importing the api key //
// import { API_KEY } from '../apikey.js';


let API_KEY;

async function loadApiKey() {
  try {
    const res = await fetch('/.netlify/functions/get-key');
    const data = await res.json();
    API_KEY = data.key;



    // Call your AI function here if needed
    // generatePrompt(API_KEY); // or whatever your flow is

  } catch (err) {
    console.error("Failed to load API key", err);
  }
}

loadApiKey();


// importing the api key //

// preveinting the user to accsese dev tools  starts //

    // document.addEventListener('contextmenu', e => e.preventDefault());

    // document.addEventListener('keydown', function(e) {
    //   if (
    //     e.key === "F12" || 
    //     (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
    //     (e.ctrlKey && e.key === 'U')
    //   ) {
    //     e.preventDefault();
    //   }
    // });


// preveinting the user to accsese dev tools  ends //


document.addEventListener('DOMContentLoaded', function () {


    const wel = document.querySelector('.wellcome');
    const overlay = document.querySelector('.overlay');
    const themeButtons  = document.querySelectorAll('.themeBtn');
    const all = document.querySelector('.all');
    const footer = document.querySelector('.footer-wr');


    // ============ wellcome message starts ============ //

      // alreat 
      alert('click anywhere/ESC to contune') 


        function rem() {

          wel.classList.add('hidden')
          overlay.classList.add('hidden')
          all.classList.remove('hidden')
          footer.classList.remove('hidden')

        }

        overlay.addEventListener('click', rem)

        wel.addEventListener('click', rem)

        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            rem();
          }

        });

    // ============ wellcome message ends ============ //


    // ============ Ai part starts ============ //



    // the app api information starts //


        const API_URL = "https://api.groq.com/openai/v1/chat/completions";
        const MODEL = "llama3-70b-8192";

    // the app api information ends //
    


        let selectedTheme = null;

        // Handle theme button clicks

        // them seceting btnm class togeling starts //

          themeButtons.forEach(button => {

            button.addEventListener("click", () => {
              themeButtons.forEach(btn => btn.classList.remove("selected"));
              button.classList.add("selected");
              selectedTheme = button.getAttribute("data-theme");
            });

          });

        // them seceting btnm class togeling ends //
        


        // Build prompt text starts //

          function buildPrompt(theme, name, place, time, purpose, notes) {
            let basePrompt = "";

            switch(theme) {
              case "friendly":
                basePrompt = `Write a short, friendly message inviting ${name}
                to meet at ${place} at ${time}.`;
                break;

              case "businessFormal":
                basePrompt = `Write a short, formal business message inviting ${name} 
                to a meeting at ${place} scheduled for ${time}.`;
                break;

              case "businessCasual":
                basePrompt = `Write a short, casual business message inviting ${name} 
                to meet at ${place} at ${time}.`;
                break;

              case "teamLead":
                basePrompt = `Write a short, supportive message from a team lead inviting
                ${name} to a meeting at ${place} at ${time}.`;
                break;

              case "client":
                basePrompt = `Write a short, polite message inviting client ${name} 
                to a meeting at ${place} at ${time}.`;
                break;

              case "partner":
                basePrompt = `Write a short, warm message inviting business partner 
                ${name} to meet at ${place} at ${time}.`;
                break;

              case "investor":
                basePrompt = `Write a short, respectful message inviting investor ${name}
                to a meeting at ${place} at ${time}.`;
                break;

              default:
                basePrompt = `Write a short message inviting ${name} to meet at ${place}
                at ${time}.`;

            }


            // Add purpose and notes if provided starts //
            
              if (purpose) {
                basePrompt += ` The purpose of the meeting is: ${purpose}.`;
              }
              if (notes) {
                basePrompt += ` Additional notes: ${notes}.`;
              }

            // Add purpose and notes if provided ends //

            // basePrompt += "Make it user friendly, sound like a human, use emojioes , use gen-z sling worlds short and easy to copy-paste.";
            // basePrompt += "Make it user friendly, sound like a human, use emojioes , use gen-z sling worlds, juts gove me the messgae no after or befreo forexapmle dont say ehres a messgae for frehsta juts sya the message and dont say feel free to copy past you got it ? dont even say anythink like dont juts gove the messgae made for ehr  , short and easy to copy-paste.";
            // basePrompt += " Make it sound human and casual, use Gen-Z slang and emojis, and just give the message—no intros, no outros, no copy-paste tips. Keep it short and clean.";
            basePrompt += " Make it sound human and casual, use Gen-Z slang and emojis, and just give the message—no intros, no outros, no copy-paste tips. Keep it short and clean. Aim for 50 to 125 words.";

            return basePrompt;

          }

        // Build prompt text ends //

        // the Groq Ai fetching the API starts //

                // Fetch from Groq

          

          async function askGroq(promptText) {

            const outputText = document.getElementById("outputText");
            const copyBtn = document.getElementById("copyBtn");


          // ============ auto cope starts ============ //

              if (!copyBtn.dataset.listenerAdded) {
                const originalSVG = copyBtn.innerHTML;

                copyBtn.addEventListener("click", () => {
                  navigator.clipboard.writeText(outputText.innerText).then(() => {
                    // Replace the button content with a checkmark SVG (or emoji)
                    copyBtn.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="green">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span class="copy" style="margin-left: 6px; font-size: 14px; color: green;">Copied</span>
                    `;

                    // After 1.5 seconds, restore original SVG
                    setTimeout(() => {
                      copyBtn.innerHTML = originalSVG;
                    }, 1500);
                  });
                });
              }

          // ============ auto cope starts ============ //


            outputText.textContent = "Generating message...";

            try {
              const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                  model: MODEL,
                  messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: promptText },
                  ],
                  temperature: 1,
                  max_tokens: 170,
                }),
              });

              if (!response.ok) {
                const errorText = await response.text();
                outputText.textContent = `API Error: ${response.status} ${errorText}`;
                return;
              }

              const data = await response.json();
              const message = data.choices?.[0]?.message?.content || "No response from AI.";
              outputText.textContent = message;

            } catch (error) {
              console.error(error);
              outputText.textContent = "Error connecting to AI API.";
            }
          }


        // the Groq Ai fet6ching the API ends //


        // Add event listeners to input fields for Enter key submission starts //

          // Generate button handler

          document.getElementById("generateBtn").addEventListener("click", () => {

            const name = document.getElementById("nameInput").value.trim();
            const place = document.getElementById("placeInput").value.trim();
            const time = document.getElementById("timeInput").value.trim();
            const purpose = document.getElementById("purposeInput").value.trim();
            const notes = document.getElementById("notesInput").value.trim();

            if (!selectedTheme || !name || !place || !time) {
              alert("Please fill out all required fields (message type, name, place, time).");
              return;
            }

            if (/https?:\/\/(www\.)?(google\.com\/maps|maps\.apple\.com)/i.test(place)) {
              alert("Please enter a place without Google Maps or Apple Maps URL.");
              return;
            }

            const prompt = buildPrompt(selectedTheme, name, place, time, purpose, notes);
            askGroq(prompt);
          });

        // Add event listeners to input fields for Enter key submission ends //



    // ============ Ai part ends ============ //


})

