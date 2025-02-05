import { Button, Checkbox, Modal, Typography } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import CloseIcon from "../components/CloseIcon/CloseIcon";
import { LevelUpModalProps } from "./definitions";
import spellList from "../data/spells.json";
import { getClassType } from "../support/helpers";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { marked } from "marked";
import DescriptionBubble from "../components/CharacterCreator/DescriptionBubble/DescriptionBubble";
import { classes } from "../data/classes";
import { ClassNames, Spell } from "../data/definitions";

const roller = new DiceRoller();

export default function LevelUpModal({
  characterData,
  handleCancel,
  isLevelUpModalOpen,
  setCharacterData,
  hitDice,
}: LevelUpModalProps) {
  const { uid, id } = useParams();
  const [spellDescription, setSpellDescription] = useState("");
  const [spellName, setSpellName] = useState("");

  const newHitDiceValue = hitDice(
    characterData.level + 1,
    characterData.class,
    characterData.hp.dice
  );
  const spells: Spell[] = spellList;

  const spellsOfLevel = (className: string[], level: number) => {
    const classType = getClassType(className);

    let filteredSpells: Spell[] = [];

    switch (classType) {
      case "standard":
        filteredSpells = spells.filter(
          (spell) => spell.level[className[0].toLowerCase()] === level
        );
        break;
      case "combination":
        filteredSpells = spells.filter((spell) =>
          className.some((cls) => spell.level[cls.toLowerCase()] === level)
        );
        break;
      case "custom":
        // If the level is 1, return all spells. Otherwise, return an empty array.
        filteredSpells = level === 1 ? spells : [];
        break;
      default:
        filteredSpells = [];
    }

    return filteredSpells;
  };

  const shouldDisableCheckbox = (
    spell: string,
    newSpellCounts: number[],
    spellBudget: number[],
    newSpells: Spell[],
    index: number
  ) => {
    return (
      spell === "Read Magic" ||
      (newSpellCounts[index] >= spellBudget[index] &&
        !newSpells.some((knownSpell) => knownSpell.name === spell))
    );
  };

  const showSpellDescription = (text: string, title?: string) => {
    title && setSpellName(title);
    setSpellDescription(text);
  };

  const SpellSelector = ({ className }: { className: string }) => {
    let spellBudget: number[] = [];
    const newSpells = characterData.spells;
    const newSpellCounts = newSpells.reduce(
      (acc: number[], spell: Spell) => {
        // If it is a combination class, just use the magic-user level
        const spellLevel =
          getClassType(characterData.class) === "combination"
            ? spell.level[ClassNames.MAGICUSER.toLowerCase()]
            : spell.level[characterData.class[0].toLowerCase()];
        if (spellLevel !== null && !isNaN(spellLevel)) {
          acc[spellLevel - 1] += 1;
        }
        return acc;
      },
      [0, 0, 0, 0, 0, 0]
    );
    if (
      classes[characterData.class[0] as ClassNames]?.spellBudget &&
      getClassType(characterData.class) !== "custom"
    ) {
      if (getClassType(characterData.class) === "standard") {
        spellBudget =
          classes[characterData.class[0] as ClassNames].spellBudget![
            characterData.level
          ];
      } else {
        // If a combination class, use the magic-user spell budget
        spellBudget = classes[ClassNames.MAGICUSER as ClassNames].spellBudget?.[
          characterData.level
        ] ?? [0];
      }
      // If the character is a custom class, allow them to choose any spells
    } else if (getClassType(characterData.class) === "custom") {
      spellBudget = new Array(6).fill(Infinity);
    }

    const handleSpellChange =
      (level: number) => (checkedValues: CheckboxValueType[]) => {
        let newCheckedSpells: Spell[] = [];

        const classType = getClassType(characterData.class);

        if (classType === "custom" && level === 1) {
          // For custom classes, handle all spells
          newCheckedSpells = spells.filter((spell) =>
            checkedValues.includes(spell.name)
          );
        } else {
          // For standard and combination classes, filter out spells of the specific level
          const classNameToCheck =
            classType === "combination"
              ? ClassNames.MAGICUSER.toLowerCase()
              : characterData.class[0].toLowerCase();

          newCheckedSpells = characterData.spells.filter(
            (spell: Spell) => spell.level[classNameToCheck] !== level
          );

          checkedValues.forEach((value) => {
            const foundSpell = spells.find((spell) => spell.name === value);
            if (foundSpell) {
              newCheckedSpells.push(foundSpell);
            }
          });
        }

        setCharacterData({ ...characterData, spells: newCheckedSpells });
      };

    const isCustomClass = getClassType(characterData.class) === "custom";

    return characterData.level < 20 && spellBudget?.length ? (
      <div className={className}>
        {spellBudget.map((max, index) => {
          if ((isCustomClass && index !== 0) || max === 0) return null;

          return (
            <div key={index} className="mb-4">
              <Typography.Title level={5}>
                {isCustomClass
                  ? "Select your Custom Class Spells"
                  : `Select Level ${index + 1} Spells`}
              </Typography.Title>
              <Checkbox.Group
                className="grid grid-cols-1 [&>*+*]:mt-2"
                value={characterData.spells.map((spell: Spell) => spell.name)}
                onChange={handleSpellChange(index + 1)}
              >
                {spellsOfLevel(characterData.class, index + 1)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((spell) => {
                    const description = marked(spell.description);
                    return (
                      <div key={spell.name}>
                        <Checkbox
                          value={spell.name}
                          disabled={shouldDisableCheckbox(
                            spell.name,
                            newSpellCounts,
                            spellBudget,
                            newSpells,
                            index
                          )}
                        >
                          {spell.name}
                          <Button
                            type="link"
                            shape="circle"
                            size="small"
                            icon={<InfoCircleOutlined />}
                            onClick={() =>
                              showSpellDescription(description, spell.name)
                            }
                            aria-label={`${spell.name} description`}
                            title={`${spell.name} description`}
                          />
                        </Checkbox>
                      </div>
                    );
                  })}
              </Checkbox.Group>
            </div>
          );
        })}
      </div>
    ) : null;
  };

  const handleLevelUp = async () => {
    const result = roller.roll(newHitDiceValue).total;
    const newCharacterData = {
      ...characterData,
      hp: { ...characterData.hp, max: result, dice: newHitDiceValue },
      level: characterData.level + 1,
    };

    // Update the character in the component state
    setCharacterData(newCharacterData);

    // Update the character in Firebase
    try {
      if (!uid || !id) {
        console.error("User ID or Character ID is undefined");
        return;
      }

      const docRef = doc(db, "users", uid, "characters", id);
      await updateDoc(docRef, {
        "hp.max": newCharacterData.hp.max,
        "hp.dice": newCharacterData.hp.dice,
        level: newCharacterData.level,
        spells: newCharacterData.spells,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }

    handleCancel();
  };

  return (
    <Modal
      title={`LEVEL UP TO LEVEL ${characterData.level + 1}`}
      open={isLevelUpModalOpen}
      onCancel={handleCancel}
      footer={false}
      closeIcon={<CloseIcon />}
      width={800}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_auto] items-start md:relative">
        <SpellSelector className="col-start-1" />
        {spellDescription !== "" && (
          <DescriptionBubble
            title={spellName ? ` ${spellName}` : ""}
            description={spellDescription}
            className="md:col-start-2 md:row-span-2 md:sticky md:top-4 self-start"
          />
        )}
      </div>
      <Button type="primary" onClick={handleLevelUp}>
        Roll new Hit Points ({newHitDiceValue})
      </Button>
    </Modal>
  );
}
