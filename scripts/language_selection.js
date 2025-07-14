function updateTranslations() {
  const elements = document.querySelectorAll(".lang");
  elements.forEach((el) => {
    const key = el.getAttribute("key");
    const lang = localStorage.getItem("lang") || "en";
    if (languages[lang] && languages[lang][key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = languages[lang][key];
      } else {
        el.textContent = languages[lang][key];
      }
    }
  });
}

function checkLanguageKey() {
  const langKey = localStorage.getItem("lang");
  console.log("Current 'lang' key in localStorage:", langKey);
  return langKey;
}

document.addEventListener('DOMContentLoaded', function () {
  if (checkLanguageKey() === null) {
    localStorage.setItem("lang", "de");
    console.log("Set default language 'de' in localStorage");
  }
  var lang = checkLanguageKey();
  console.log("Detected language code: " + lang);
  
  document.querySelectorAll(".translate").forEach(function(element) {
    element.value = localStorage.getItem("lang");
    element.dispatchEvent(new Event('change'));
  });
  updateTranslations(lang);

  function changeHandler(event) {
    var lang = event.target.value;
    localStorage.setItem("lang", lang);
    console.log("localStorage-value for key 'lang' updated to '" + lang + "'");
    updateTranslations(lang);

    document.querySelectorAll(".translate").forEach(function(element) {
      element.removeEventListener("change", changeHandler);
      element.value = lang;
    });
    document.querySelectorAll(".translate").forEach(function(element) {
      element.addEventListener("change", changeHandler);
    });

    // Notify parent window of language change
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'languageChange', lang: lang }, '*');
    }
  }

  document.querySelectorAll(".translate").forEach(function(element) {
    element.addEventListener("change", changeHandler);
  });
});
