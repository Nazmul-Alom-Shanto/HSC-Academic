async function init() {
    try{
        const response = await fetch('./assets/json/paragraph-125.json');
        if(!response.ok){
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        hereYouGo(data.paragraphs);
    } catch(err){
        console.error("something went wrong! ", err.message);
    }
}

function hereYouGo(paragraphs){
    const paragraphContainer = document.getElementById("paragraph-container");
    const searchBar = document.getElementById("search-bar");

    function maleSpeaking(text){
        const utarance = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        speechSynthesis.speak(utarance);
    }
    // Render paragraphs
    function renderParagraphs() {
        paragraphContainer.innerHTML = ""; // Clear previous content
        paragraphs.forEach((paragraph, index) => {
            const dropdown = document.createElement("div");
            dropdown.className = "dropdown";

            const dropdownHeader = document.createElement("div");
            dropdownHeader.className = "dropdown-header";
            const spanHeader = document.createElement("span");
            const ParagraphName = `${paragraphs.indexOf(paragraph) + 1}. ${paragraph.Name}`; //this line
            spanHeader.textContent = ParagraphName;
            const spanArrow = document.createElement("span");
            spanArrow.className = "arrow";
            spanArrow.textContent = "▼";

            const dropdownContent = document.createElement("div");
            dropdownContent.className = "dropdown-content";
            const questionsList = document.createElement("ul");
            paragraph.Questions.forEach(question => {
                const questionItem = document.createElement("li");
                questionItem.textContent = question;
                questionsList.appendChild(questionItem);
            });
            const para = document.createElement("p");
            para.innerHTML = paragraph.Paragraph;

            const play = document.createElement('button');
            play.className = "play-btn";
            play.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';
            let isSpeaking = false; // Tracks the speaking state

            play.addEventListener("click", (event) => {
                event.stopPropagation();
                if (isSpeaking) {
                    speechSynthesis.cancel(); // Pause speech synthesis
                    play.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>'; // Update button text

                    isSpeaking = false;
                } else {
                    speechSynthesis.resume(); // Resume speech synthesis if paused
                    maleSpeaking(paragraph.Paragraph); // Start speech synthesis
                    isSpeaking = true;
                    play.innerHTML =  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';
                }
            });
            const copyButtonTooltip = document.createElement('span');
            copyButtonTooltip.className = "copy-tooltip";
            copyButtonTooltip.textContent = "Copied!";

            const copyButton = document.createElement("button");
            copyButton.className = "copy";
            copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>';
            copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(paragraph.Paragraph).then(() => {
                copyButtonTooltip.style.display = "block";
            setTimeout(function(){
                copyButtonTooltip.style.display = "none";

            },750);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        
        });
      
            
            dropdownHeader.appendChild(spanHeader);
           // dropdownHeader.appendChild(spanArrow);
            dropdownHeader.appendChild(play);
            dropdownContent.appendChild(copyButton);
            dropdownContent.appendChild(copyButtonTooltip);
            dropdownContent.appendChild(questionsList);
            dropdownContent.appendChild(para);
            dropdown.appendChild(dropdownHeader);
            dropdown.appendChild(dropdownContent);

            paragraphContainer.appendChild(dropdown);

            // Add toggle functionality
            dropdownHeader.addEventListener("click", () => {
                dropdown.classList.toggle("active");
            });
        });
    }

    renderParagraphs();

    // Add search functionality
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const dropdowns = document.querySelectorAll(".dropdown");

        dropdowns.forEach(dropdown => {
            const headerText = dropdown.querySelector(".dropdown-header span").textContent.toLowerCase();
            const contentText = dropdown.querySelector(".dropdown-content").textContent.toLowerCase();
            const paragraphText = dropdown.querySelector(".dropdown-content p");

            // Show or hide dropdown based on query
            if (headerText.includes(query) || contentText.includes(query)) {
                dropdown.style.display = "block";

                // Highlight matching text
                if (query) {
                    paragraphText.innerHTML = paragraphText.textContent.replace(
                        new RegExp(query, "gi"),
                        (match) => `<span class="highlight">${match}</span>`
                    );
                }
            } else {
                dropdown.style.display = "none";
            }
        });
    });

}

init();