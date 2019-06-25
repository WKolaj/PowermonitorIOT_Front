import translation from "../translations.json";
import store from "../store.js";

export const translate = phrase => {
  let userPreferences = store.getState()["userPreferences"];
  if (!userPreferences) return phrase;

  let lang = userPreferences.lang;
  if (!lang) return phrase;

  let allTranslations = translation[phrase];
  if (!allTranslations) return phrase;

  let translatedPhrase = allTranslations[lang];
  if (!translatedPhrase) return phrase;

  //returning translated Phrase - if not empty or phrase given as an argument
  return translatedPhrase;
};

export default translate;
