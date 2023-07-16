let checkboxes = document.querySelectorAll("input[type=checkbox]");
let preview = document.querySelector("#preview");

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const highlightCSS = document.getElementById("highlight-css");

// Dark mode kontrolü
function checkDarkMode() {
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDarkMode) {
    body.classList.add("dark-mode");
    highlightCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css";
  } else {
    body.classList.remove("dark-mode");
    highlightCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css";
  }
}

// Tema değiştirici butonu
themeToggle.addEventListener("click", function() {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    highlightCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css";
  } else {
    highlightCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css";
  }
});

// Sayfa yüklendiğinde tema kontrolü yapılıyor
document.addEventListener("DOMContentLoaded", function() {
  checkDarkMode();
});

checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener("change", function() {
    let batchCode = getBatchCode(this.value);
    if (this.checked) {
      preview.textContent += "\n" + batchCode;
    } else {
      preview.textContent = preview.textContent.replace("\n" + batchCode, "");
    }
    updateLineNumbers();
    hljs.highlightBlock(preview);
  });
});

let batchCodes = {};

function getBatchCode(batchName) {
  if (batchCodes[batchName]) {
    return batchCodes[batchName];
  }

  let file = 'code/' + batchName + '.txt';
  let xhr = new XMLHttpRequest();
  xhr.open('GET', file, false);
  xhr.send();

  if (xhr.status === 200) {
    batchCodes[batchName] = xhr.responseText;
    return batchCodes[batchName];
  }

  return null;
}

// Preload batch codes on page load
batchCodeNames.forEach(function(batchName) {
  getBatchCode(batchName);
});

function copyCode() {
  let code = preview.textContent;
  code += "\n\npause\r\nexit /b 0"; // Eklenecek kod
  let textarea = document.createElement("textarea");
  textarea.value = code;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}


function downloadCode() {
  let code = preview.textContent;
  code += "\n\npause\r\nexit /b 0"; // Eklenecek kod
  let blob = new Blob([code], {type: "text/plain;charset=utf-8"});
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "BatchCraft.bat";
  a.click();
}


function updateLineNumbers() {
  let lines = preview.textContent.split("\n");
  let lineNumbers = "";
  for (let i = 1; i < lines.length; i++) {
    lineNumbers += i;
    if (i < lines.length) {
      lineNumbers += "\n";
    }
  }
  preview.setAttribute("data-line-number", lineNumbers);
  hljs.highlightBlock(preview);

  // Satır numaralarını güncelleyen yeni kod
  let lineNumbersElement = document.querySelector(".line-numbers");
  if (!lineNumbersElement) {
    lineNumbersElement = document.createElement("pre");
    lineNumbersElement.classList.add("line-numbers");
    preview.parentNode.insertBefore(lineNumbersElement, preview);
  }

  lineNumbersElement.textContent = lineNumbers;
  hljs.highlightBlock(lineNumbersElement);
  hljs.initHighlightingOnLoad();
}

updateLineNumbers();
