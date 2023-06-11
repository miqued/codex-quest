import { Checkbox, Col, Divider, Radio, Row, Switch } from "antd";
import type { RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect } from "react";
import { CharClassStepProps } from "../types";
import spellsData from "../../data/spells.json";
import { classDetails } from "../../data/classDetails";

const classChoices = ["Cleric", "Fighter", "Magic-User", "Thief"];
const readMagic = spellsData.filter((spell) => spell.name === "Read Magic");

export default function CharClassStep({
  characterData,
  setCharacterData,
  comboClass,
  setComboClass,
  checkedClasses,
  setCheckedClasses,
  selectedSpell,
  setSelectedSpell,
}: CharClassStepProps) {
  useEffect(() => {
    if (comboClass) {
      const firstClass =
        checkedClasses[0]?.toLowerCase() as keyof typeof classDetails;
      const secondClass =
        checkedClasses[1]?.toLowerCase() as keyof typeof classDetails;
      const firstClassRestrictions = firstClass
        ? classDetails[firstClass].restrictions
        : [];
      const firstClassSpecials = firstClass
        ? classDetails[firstClass].specials
        : [];
      const secondClassRestrictions = secondClass
        ? classDetails[secondClass].restrictions
        : [];
      const secondClassSpecials = secondClass
        ? classDetails[secondClass].specials
        : [];

      setCharacterData({
        ...characterData,
        class: checkedClasses.join(" "),
        restrictions: {
          race: characterData.restrictions.race,
          class: [...firstClassRestrictions, ...secondClassRestrictions],
        },
        specials: {
          race: characterData.specials.race,
          class: [...firstClassSpecials, ...secondClassSpecials],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedClasses, comboClass]);

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setCheckedClasses([...checkedClasses, e.target.value]);
    } else {
      setCheckedClasses(
        checkedClasses.filter((item) => item !== e.target.value)
      );
    }
    setCharacterData({
      ...characterData,
      hp: { dice: "", points: 0, max: 0, desc: "" },
    });
  };

  const onClassRadioChange = (e: RadioChangeEvent) => {
    const classValue = e.target.value;
    setSelectedSpell(null);
    const spells = classValue === "Magic-User" ? readMagic : [];
    const thisClass = e.target.value
      .toString()
      .toLowerCase() as keyof typeof classDetails;

    setCharacterData({
      ...characterData,
      class: classValue,
      hp: { dice: "", points: 0, max: 0, desc: "" },
      spells,
      restrictions: {
        race: characterData.restrictions.race,
        class: [...classDetails[thisClass].restrictions],
      },
      specials: {
        race: characterData.specials.race,
        class: [...classDetails[thisClass].specials],
      },
    });
  };

  const onSpellRadioChange = (e: RadioChangeEvent) => {
    const foundSpell = spellsData.find(
      (spell) => spell.name === e.target.value
    );
    if (foundSpell) {
      setSelectedSpell(foundSpell);
      setCharacterData({
        ...characterData,
        spells: [...readMagic, foundSpell],
      });
    }
  };

  const onSwitchChange = (checked: boolean) => {
    if (checked !== comboClass) {
      // Only update the playerClass if the switch has actually been toggled
      // Clear whenever the switch is clicked
      setCheckedClasses([]);
      setCharacterData({
        ...characterData,
        class: "",
        hp: { dice: "", points: 0, max: 0, desc: "" },
      });
    }
    setComboClass(checked);
  };

  return (
    <>
      {characterData.race === "Elf" && (
        <div>
          <Switch
            checked={comboClass}
            onChange={onSwitchChange}
            unCheckedChildren="Single Class"
            checkedChildren="Combination Class"
          />
        </div>
      )}
      <Row className="mt-6 flex-col">
        <Col xs={24} sm={4}>
          {comboClass ? (
            <div className="flex flex-wrap gap-4">
              {classChoices.map((choice) => (
                <Checkbox
                  key={choice}
                  onChange={onCheckboxChange}
                  value={choice}
                  className="flex-[1_1_40%]"
                  checked={checkedClasses.includes(choice)}
                  disabled={
                    choice === "Cleric" ||
                    (choice === "Fighter" &&
                      checkedClasses.includes("Thief")) ||
                    (choice === "Thief" &&
                      checkedClasses.includes("Fighter")) ||
                    (choice === "Fighter" &&
                      +characterData.abilities.scores.strength < 9) ||
                    (choice === "Magic-User" &&
                      +characterData.abilities.scores.intelligence < 9) ||
                    (choice === "Thief" &&
                      +characterData.abilities.scores.dexterity < 9)
                  }
                >
                  {choice}
                </Checkbox>
              ))}
            </div>
          ) : (
            <Radio.Group
              value={characterData.class}
              onChange={onClassRadioChange}
              className="flex flex-wrap gap-4"
            >
              {classChoices.map((choice) => (
                <Radio
                  key={choice}
                  value={choice}
                  className="flex-1"
                  disabled={
                    (characterData.race === "Dwarf" &&
                      choice === "Magic-User") ||
                    (characterData.race === "Halfling" &&
                      choice === "Magic-User") ||
                    (choice === "Cleric" &&
                      +characterData.abilities.scores.wisdom < 9) ||
                    (choice === "Fighter" &&
                      +characterData.abilities.scores.strength < 9) ||
                    (choice === "Magic-User" &&
                      +characterData.abilities.scores.intelligence < 9) ||
                    (choice === "Thief" &&
                      +characterData.abilities.scores.dexterity < 9)
                  }
                >
                  {choice}
                </Radio>
              ))}
            </Radio.Group>
          )}
        </Col>
        {characterData.class.includes("Magic-User") && (
          <>
            <Divider />
            <Col xs={24} sm={20}>
              <Radio.Group
                onChange={onSpellRadioChange}
                value={selectedSpell ? selectedSpell.name : null}
                className="flex flex-wrap gap-4 items-center"
              >
                {spellsData
                  .filter(
                    (spell) =>
                      spell.level["magic-user"] === 1 &&
                      spell.name !== "Read Magic"
                  )
                  .map((spell) => (
                    <Radio
                      key={spell.name}
                      value={spell.name}
                      className="flex-1"
                    >
                      {spell.name}
                    </Radio>
                  ))}
              </Radio.Group>
            </Col>
          </>
        )}
      </Row>
    </>
  );
}
