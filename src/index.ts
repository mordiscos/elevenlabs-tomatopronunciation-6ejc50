import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";

const elevenlabs = new ElevenLabsClient({
  apiKey: "YOUR_API_KEY"
});

async function createPronunciationDictionary() {
  const fileStream = fs.createReadStream("path/to/phonemes.psl");
  const response = await elevenlabs.pronunciationDictionary.addFromFile(fileStream, {
    name: "TomatoPhonemes"
  });
  console.log("Dictionary created:", response);
  return response.dictionaryId;
}

async function playTomato(voiceId: string, dictionaryId: string) {
  const audio = await elevenlabs.generate({
    text: "tomato",
    voice: voiceId,
    pronunciationDictionaryIds: [dictionaryId]
  });
  console.log("Playing audio:", audio);
}

async function removeTomatoRule(dictionaryId: string) {
  const response = await elevenlabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary(dictionaryId, {
    ruleStrings: ["tomato", "Tomato"]
  });
  console.log("Tomato rule removed:", response);
}

async function addTomatoRule(dictionaryId: string) {
  const response = await elevenlabs.pronunciationDictionary.addRulesToThePronunciationDictionary(dictionaryId, {
    rules: [
      {
        stringToReplace: "tomato",
        phoneme: "təˈmeɪtoʊ",
        alphabet: "ipa",
        type: "phoneme"
      },
      {
        stringToReplace: "Tomato",
        phoneme: "Təˈmeɪtoʊ",
        alphabet: "ipa",
        type: "phoneme"
      }
    ]
  });
  console.log("Tomato rule added:", response);
}

async function main() {
  try {
    const dictionaryId = await createPronunciationDictionary();

    // Play "tomato" with the created dictionary
    await playTomato("Rachel", dictionaryId);

    // Remove the "tomato" rule and play again
    await removeTomatoRule(dictionaryId);
    await playTomato("Rachel", dictionaryId);

    // Add the "tomato" rule again and play
    await addTomatoRule(dictionaryId);
    await playTomato("Rachel", dictionaryId);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
