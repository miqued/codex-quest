import { marked } from "marked";
import { useState } from "react";
import { Button, Divider, Steps, Typography, message } from "antd";
import CharacterAbilities from "../../components/CharacterCreator/CharacterAbilities/CharacterAbilities";
import CharacterRace from "../../components/CharacterCreator/CharacterRace/CharacterRace";
import CharacterClass from "../../components/CharacterCreator/CharacterClass/CharacterClass";
import CharacterHitPoints from "../../components/CharacterCreator/CharacterHitPoints/CharacterHitPoints";
import EquipmentStore from "../../components/EquipmentStore/EquipmentStore";
import CharacterName from "../../components/CharacterCreator/CharacterName/CharacterName";
import { useNavigate, useOutletContext } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { classes } from "../../data/classes";
import {
  Abilities,
  CharacterData,
  ClassNames,
  Spell,
} from "../../data/definitions";

const abilityDescription = marked(
  `Roll for your character's Abilities. **You can click the "Roll" buttons or use your own dice and record your scores**. Afterward your character will have a score ranging from 3 to 18 in each of the Abilities below. A bonus (or penalty) Modifier is then associated with each score. Your character's Abilities will begin to determine the options available to them in the next steps as well, so good luck!
  
  <a href="https://basicfantasy.org/srd/abilities.html" target="_blank">BFRPG Character Ability documentation</a>`
);

const raceDescription = marked(
  `Choose your character's Race. **Some options may be unavailable due to your character's Ability Scores**. Each Race except Humans has a minimum and maximum value for specific Abilities that your character's Ability Scores must meet in order to select them. Consider that each Race has specific restrictions, special abilities, and Saving Throws. Choose wisely. **Races included in the base game rules are in bold**.
  
  <a href="https://basicfantasy.org/srd/races.html" target="_blank">BFRPG Character Race documentation</a>`
);

const classDescription = marked(
  `Choose your character's Class. **Your character's Race and Ability Scores will determine which Class options are available**. Your Class choice determines your character's background and how they will progress through the game as they level up. **Classes included in the base game rules are in bold**.
  
  <a href="https://basicfantasy.org/srd/class.html" target="_blank">BFRPG Character Class documentation</a>`
);

const hitPointsDescription = marked(
  `Roll for your character's Hit Points. **Your character's Race may place restrictions on the Hit Dice available to them, but generally this is determined by their chosen Class**. Additionally, your character's Constitution modifier is added/subtracted from this value with a minimum value of 1. The end result is the amount of Hit Points your character will start with and determines how much damage your character can take in battle.
  
  <a href="https://basicfantasy.org/srd/abilities.html#hit-points-and-hit-dice" target="_blank">BFRPG Character Hit Points documentation</a>`
);

const equipmentDescription = marked(
  `Roll for your character's starting gold and purchase their equipment. **Keep in mind that your character's Race and Class selections may limit types and amounts of equipment they can have**.
  
  <a href="https://basicfantasy.org/srd/equipment.html" target="_blank">BFRPG Character Equipment documentation</a>`
);

const nameDescription = marked(
  `You're almost done! Personalize your newly minted character by giving them an identity. Optionally, upload a portrait image if you'd like. Image must be PNG/JPG and <= 1mb`
);

const emptyCharacter = {
  abilities: {
    scores: {
      strength: 0,
      intelligence: 0,
      wisdom: 0,
      constitution: 0,
      dexterity: 0,
      charisma: 0,
    },
    modifiers: {
      strength: "",
      intelligence: "",
      wisdom: "",
      constitution: "",
      dexterity: "",
      charisma: "",
    },
  },
  class: [],
  race: "",
  hp: {
    dice: "",
    points: 0,
    max: 0,
    desc: "",
  },
  spells: [],
  gold: 0,
  equipment: [],
  weight: 0,
  name: "",
  avatar: "",
  level: 1,
  specials: { race: [], class: [] },
  restrictions: { race: [], class: [] },
  savingThrows: {
    deathRayOrPoison: 0,
    magicWands: 0,
    paralysisOrPetrify: 0,
    dragonBreath: 0,
    spells: 0,
  },
  xp: 0,
  desc: "",
  wearing: {
    armor: "",
    shield: "",
  },
};

export default function CharacterCreator() {
  const outletContext = useOutletContext() as { className: string };
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [comboClass, setComboClass] = useState(false);
  const [checkedClasses, setCheckedClasses] = useState<string[]>([]);
  const [characterData, setCharacterData] =
    useState<CharacterData>(emptyCharacter);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const steps = [
    {
      title: "Abilities",
      fullTitle: "Roll for Ability Scores",
      description: abilityDescription,
      content: (
        <CharacterAbilities
          characterData={characterData}
          setCharacterData={setCharacterData}
          setComboClass={setComboClass}
          setCheckedClasses={setCheckedClasses}
        />
      ),
    },
    {
      title: "Race",
      fullTitle: "Choose a Race",
      description: raceDescription,
      content: (
        <CharacterRace
          setComboClass={setComboClass}
          setCheckedClasses={setCheckedClasses}
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      ),
    },
    {
      title: "Class",
      fullTitle: "Choose a Class",
      description: classDescription,
      content: (
        <CharacterClass
          comboClass={comboClass}
          setComboClass={setComboClass}
          checkedClasses={checkedClasses}
          setCheckedClasses={setCheckedClasses}
          characterData={characterData}
          setCharacterData={setCharacterData}
          selectedSpell={selectedSpell}
          setSelectedSpell={setSelectedSpell}
        />
      ),
    },
    {
      title: "Hit Points",
      fullTitle: "Roll for Hit Points",
      description: hitPointsDescription,
      content: (
        <CharacterHitPoints
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      ),
    },
    {
      title: "Equipment",
      fullTitle: "Buy Equipment",
      description: equipmentDescription,
      content: (
        <EquipmentStore
          characterData={characterData}
          setCharacterData={setCharacterData}
          inBuilder
        />
      ),
    },
    {
      title: "Name",
      fullTitle: "Name your character",
      description: nameDescription,
      content: (
        <CharacterName
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  function areAllAbilitiesSet(abilities: Abilities) {
    for (let key in abilities) {
      const value = +abilities[key as keyof typeof abilities];
      if (value <= 0 || isNaN(value)) {
        return false;
      }
    }
    return true;
  }

  function isNextButtonEnabled(currentStep: number) {
    switch (currentStep) {
      case 0:
        return areAllAbilitiesSet(characterData.abilities.scores);
      case 1:
        return characterData.race !== "";
      case 2:
        // Check if the character has a class
        // AND IF SO, any value in their class has a spell budget
        // AND IF SO, they have more than 1 spell
        if (characterData.class.length === 0) {
          return false;
        } else if (
          characterData.class.some((className) => {
            const spellBudget = classes[className as ClassNames]?.spellBudget;
            return spellBudget && spellBudget[0] && spellBudget[0][0] > 0;
          })
        ) {
          return characterData.spells.length > 1;
        }
        return true;
      case 3:
        return characterData.hp.points !== 0;
      case 4:
        return characterData.equipment.length !== 0;
      case 5:
        return characterData.name;
      default:
        return true;
    }
  }

  const success = (name: string) => {
    messageApi.open({
      type: "success",
      content: `${name} successfully saved!`,
    });
  };

  const errorMessage = (message: string) => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };

  async function addCharacterData(characterData: CharacterData) {
    // Check if a user is currently logged in
    if (auth.currentUser) {
      // Get the current user's UID
      const uid = auth.currentUser.uid;

      // Get a reference to the Firestore document
      const docRef = doc(collection(db, `users/${uid}/characters`));

      // Set the character data for the current user
      try {
        await setDoc(docRef, characterData);
        success(characterData.name);
        // Go back to Home
        navigate("/");
        // Reset characterData
        setCharacterData(emptyCharacter);
        // Reset step
        setCurrent(0);
      } catch (error) {
        console.error("Error writing document: ", error);
        errorMessage(`Error writing document (see console)`);
      }
    } else {
      console.error("No user is currently logged in.");
      errorMessage(`No user is currently logged in.`);
    }
  }

  const FloatingGold = () => {
    return (
      <div className="sticky top-4 z-10 sm:hidden inline-block float-right bg-seaBuckthorn p-2 rounded shadow-md font-bold italic">
        {`Gold: ${characterData.gold.toFixed(2)}`}
      </div>
    );
  };

  return (
    <div className={`${outletContext.className}`}>
      {contextHolder}
      <div className="grid gap-4 md:grid-cols-[auto_auto] grid-rows-[auto_auto_auto] items-start">
        <Steps
          current={current}
          items={items}
          direction="vertical"
          progressDot
          className="hidden md:block"
        />
        <div className="relative">
          {current === 4 && <FloatingGold />}
          <Typography.Title
            level={1}
            className="mt-0 text-shipGray font-enchant text-5xl tracking-wide"
          >
            {steps[current].fullTitle}
          </Typography.Title>
          <Typography.Paragraph>
            <div
              dangerouslySetInnerHTML={{
                __html: steps[current].description,
              }}
            />
          </Typography.Paragraph>
          <Divider className="border-seaBuckthorn" />
          {steps[current].content}
        </div>
        <div className="col-span-full ml-auto">
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => next()}
              disabled={!isNextButtonEnabled(current)}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => addCharacterData(characterData)}
              disabled={!isNextButtonEnabled(current)}
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
