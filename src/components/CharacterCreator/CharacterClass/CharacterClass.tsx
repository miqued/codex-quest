import { useEffect, useState } from "react";
import { Switch } from "antd";
import { getClassType } from "../../../support/helpers";
import { races } from "../../../data/races";
import { classes } from "../../../data/classes";
import SpellDescriptionModal from "./SpellDescriptionModal/SpellDescriptionModal";
import StartingSpells from "./StartingSpells/StartingSpells";
import CustomClassInput from "./CustomClassInput/CustomClassInput";
import CustomClassStartingSpells from "./CustomClassStartingSpells/CustomClassStartingSpells";
import ClassOptions from "./ClassOptions/ClassOptions";
import CombinationClassOptions from "./CombinationClassOptions/CombinationClassOptions";
import {
  CharacterDataStatePair,
  ClassNames,
  Spell,
} from "../../../data/definitions";

interface CharacterClassProps extends CharacterDataStatePair {
  comboClass: boolean;
  setComboClass: (comboClass: boolean) => void;
  checkedClasses: string[];
  setCheckedClasses: (checkedClasses: string[]) => void;
  selectedSpell: Spell | null;
  setSelectedSpell: (spell: Spell | null) => void;
}

export default function CharacterClass({
  characterData,
  setCharacterData,
  comboClass,
  setComboClass,
  checkedClasses,
  setCheckedClasses,
  selectedSpell,
  setSelectedSpell,
}: CharacterClassProps) {
  const [customClassInput, setCustomClassInput] = useState<string>("");
  const [showCustomClassInput, setShowCustomClassInput] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalName, setModalName] = useState<string | undefined>(undefined);
  const [modalDescription, setModalDescription] = useState<string>("");

  useEffect(() => {
    if (
      getClassType(characterData.class) === "custom" &&
      characterData.class[0] !== ""
    ) {
      setShowCustomClassInput(true);
      setCustomClassInput(characterData.class.join(" "));
    } else {
      setCustomClassInput("");
    }
  }, [characterData.class]);

  useEffect(() => {
    if (comboClass) {
      setCharacterData({
        ...characterData,
        class: checkedClasses,
      });
    }
  }, [checkedClasses, comboClass]);

  const onSwitchChange = (checked: boolean) => {
    if (checked !== comboClass) {
      // Only update the playerClass if the switch has actually been toggled
      // Clear whenever the switch is clicked
      setCustomClassInput("");
      setShowCustomClassInput(false);
      setCheckedClasses([]);
      setCharacterData({
        ...characterData,
        class: [],
        hp: { dice: "", points: 0, max: 0, desc: "" },
      });
    }
    setComboClass(checked);
  };

  const raceKey = characterData.race as keyof typeof races;
  const allowedCombinationClasses = races[raceKey]?.allowedCombinationClasses;

  const showStartingSpells = (classValue: string[]) => {
    if (!classValue) return false;
    return classValue
      .map((className) => classes[className as ClassNames]?.spellBudget)
      .some((budget) => budget && budget[0][0] > 0);
  };

  return (
    <>
      {allowedCombinationClasses && allowedCombinationClasses.length > 1 && (
        <Switch
          checked={comboClass}
          onChange={onSwitchChange}
          unCheckedChildren="Single Class"
          checkedChildren="Combination Class"
        />
      )}
      <div className="mt-6">
        {comboClass ? (
          <CombinationClassOptions
            characterData={characterData}
            setCharacterData={setCharacterData}
            checkedClasses={checkedClasses}
            setCheckedClasses={setCheckedClasses}
            raceKey={raceKey}
          />
        ) : (
          <ClassOptions
            characterData={characterData}
            setCharacterData={setCharacterData}
            customClassInput={customClassInput}
            setShowCustomClassInput={setShowCustomClassInput}
            setSelectedSpell={setSelectedSpell}
          />
        )}
        {showCustomClassInput && (
          <CustomClassInput
            characterData={characterData}
            customClassInput={customClassInput}
            setCharacterData={setCharacterData}
            setCustomClassInput={setCustomClassInput}
          />
        )}
        {getClassType(characterData.class) === "custom" && (
          <CustomClassStartingSpells
            characterData={characterData}
            setCharacterData={setCharacterData}
          />
        )}
        {getClassType(characterData.class) !== "custom" &&
          showStartingSpells(characterData.class) && (
            <StartingSpells
              characterData={characterData}
              setCharacterData={setCharacterData}
              selectedSpell={selectedSpell}
              setSelectedSpell={setSelectedSpell}
              setModalName={setModalName}
              setModalDescription={setModalDescription}
              setIsModalOpen={setIsModalOpen}
            />
          )}
        <SpellDescriptionModal
          title={modalName || ""}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          description={modalDescription}
        />
      </div>
    </>
  );
}
