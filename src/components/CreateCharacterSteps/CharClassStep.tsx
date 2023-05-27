import { Checkbox, List, Radio, Space, Switch } from "antd";
import type { RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect } from "react";
import { CharClassStepProps } from "../types";
import spellsData from "../../data/spells.json";

const classChoices = ["Cleric", "Fighter", "Magic-User", "Thief"];

export default function CharClassStep({
  abilities,
  race,
  playerClass,
  setPlayerClass,
  comboClass,
  setComboClass,
  checkedClasses,
  setCheckedClasses,
  setHitDice,
  setHitPoints,
  spells,
  setSpells,
}: CharClassStepProps) {
  useEffect(() => {
    if (comboClass) {
      setPlayerClass(checkedClasses.join(" "));
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
    setHitDice("");
    setHitPoints(0);
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setPlayerClass(e.target.value);
    setHitDice("");
    setHitPoints(0);
  };

  const onSwitchChange = (checked: boolean) => {
    if (checked !== comboClass) {
      // Only update the playerClass if the switch has actually been toggled
      setPlayerClass("");
      // Clear whenever the switch is clicked
      setCheckedClasses([]);
      setHitDice("");
      setHitPoints(0);
    }
    setComboClass(checked);
  };

  return (
    <>
      {race === "Elf" && (
        <div>
          <Switch
            checked={comboClass}
            onChange={onSwitchChange}
            unCheckedChildren="Single Class"
            checkedChildren="Combination Class"
          />
        </div>
      )}
      {comboClass ? (
        <Space direction="vertical">
          {classChoices.map((choice) => (
            <Checkbox
              key={choice}
              onChange={onCheckboxChange}
              value={choice}
              checked={checkedClasses.includes(choice)}
              disabled={
                choice === "Cleric" ||
                (choice === "Fighter" && checkedClasses.includes("Thief")) ||
                (choice === "Thief" && checkedClasses.includes("Fighter")) ||
                (choice === "Fighter" && abilities.strength < 9) ||
                (choice === "Magic-User" && abilities.intelligence < 9) ||
                (choice === "Thief" && abilities.dexterity < 9)
              }
            >
              {choice}
            </Checkbox>
          ))}
        </Space>
      ) : (
        <Radio.Group value={playerClass} onChange={onRadioChange}>
          <Space direction="vertical">
            {classChoices.map((choice) => (
              <Radio
                key={choice}
                value={choice}
                disabled={
                  (race === "Dwarf" && choice === "Magic-User") ||
                  (race === "Halfling" && choice === "Magic-User") ||
                  (choice === "Cleric" && abilities.wisdom < 9) ||
                  (choice === "Fighter" && abilities.strength < 9) ||
                  (choice === "Magic-User" && abilities.intelligence < 9) ||
                  (choice === "Thief" && abilities.dexterity < 9)
                }
              >
                {choice}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
      {playerClass.includes("Magic-User") && (
        <Radio.Group onChange={() => console.log("foo")} value={spells}>
          <Space direction="vertical">
            {spellsData
              .filter(
                (spell) =>
                  spell.level["magic-user"] === 1 && spell.name !== "Read Magic"
              )
              .map((spell) => (
                <Radio>{spell.name}</Radio>
              ))}
          </Space>
        </Radio.Group>
      )}
    </>
  );
}
