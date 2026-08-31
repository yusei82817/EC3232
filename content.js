const button = document.createElement("button");
button.textContent = "TEST";
button.id = "chatgpt-helper-button";

button.addEventListener("click", () => {
  alert("ChatGPT Helper is working!");
});

document.body.appendChild(button);
