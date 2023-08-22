import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import { CharacterHitPointsProps } from "./definitions";
import HomebrewWarning from "../../HomebrewWarning/HomebrewWarning";
import { DiceTypes } from "../../definitions";
import { getClassType } from "../../../support/helpers";
import { ClassNamesTwo, classes } from "../../../data/classes";

export default function CharacterHitPoints({
  characterData,
  setCharacterData,
}: CharacterHitPointsProps) {
  const [customHitDice, setCustomHitDice] = useState("");

  const roller = new DiceRoller();

  useEffect(() => {
    let dice = DiceTypes.D6;

    if (getClassType(characterData.class) === "custom") {
    }
    if (getClassType(characterData.class) === "combination") {
    }
    if (getClassType(characterData.class) === "standard") {
      const classDie =
        classes[characterData.class as keyof typeof classes].hitDice;

      console.log(classDie);
    }

    // if (getClassType(characterData.class) === "custom") {
    //   if (characterData.class.includes(ClassNames.THIEF)) {
    //     dice = DiceTypes.D4;
    //   } else {
    //     dice = DiceTypes.D6;
    //   }
    // } else if (getClassType(characterData.class) === "combination") {
    //   if (characterData.class.includes(ClassNames.FIGHTER)) dice = DiceTypes.D6;
    //   if (characterData.class.includes(ClassNames.THIEF)) dice = DiceTypes.D4;
    // } else {
    //   if (
    //     characterData.class === ClassNames.CLERIC ||
    //     characterData.class === ClassNames.DRUID
    //   ) {
    //     dice = DiceTypes.D6;
    //   } else if (characterData.class === ClassNames.FIGHTER) {
    //     dice = DiceTypes.D8;
    //     if (
    //       characterData.race === RaceNames.ELF ||
    //       characterData.race === RaceNames.HALFLING ||
    //       characterData.race === RaceNames.GNOME
    //     ) {
    //       dice = DiceTypes.D6;
    //     }
    //   } else if (
    //     characterData.class === ClassNames.MAGICUSER ||
    //     characterData.class === ClassNames.THIEF ||
    //     characterData.class === ClassNames.ASSASSIN ||
    //     characterData.class === ClassNames.ILLUSIONIST
    //   ) {
    //     dice = DiceTypes.D4;
    //   } else if (characterData.class === ClassNames.BARBARIAN) {
    //     dice = DiceTypes.D10;
    //   } // else dice = characterData.hp.dice;
    // }

    setCharacterData({
      ...characterData,
      hp: {
        ...characterData.hp,
        dice,
      },
    });
  }, []);

  const onClick = () => {
    const result = roller.roll(characterData.hp.dice);
    if (!(result instanceof Array)) handleHitPointValue(result.total);
  };

  const handleHitPointValue = (value: number | null) => {
    if (value === null) return;
    value += +characterData.abilities.modifiers.constitution;
    if (value < 1) value = 1;
    setCharacterData({
      ...characterData,
      hp: { ...characterData.hp, points: value, max: value },
    });
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleChangeCustomHitDice = (event: RadioChangeEvent) => {
    setCustomHitDice(event.target.value);
    setCharacterData({
      ...characterData,
      hp: {
        ...characterData.hp,
        dice: event.target.value,
      },
    });
  };

  return (
    <>
      {!characterData.class
        .split(" ")
        .some((part) =>
          Object.values(ClassNamesTwo).includes(part as ClassNamesTwo)
        ) && (
        <>
          <Radio.Group
            value={customHitDice}
            onChange={handleChangeCustomHitDice}
            buttonStyle="solid"
            className="block mb-4"
          >
            <Radio.Button value="d4">d4</Radio.Button>
            <Radio.Button value="d6">d6</Radio.Button>
            <Radio.Button value="d8">d8</Radio.Button>
            <Radio.Button value="d10">d10</Radio.Button>
            <Radio.Button value="d12">d12</Radio.Button>
            <Radio.Button value="d20">d20</Radio.Button>
          </Radio.Group>
          <HomebrewWarning homebrew="Race or Class" />
          <Divider />
        </>
      )}
      <Space.Compact>
        <InputNumber
          max={11}
          min={1}
          defaultValue={0}
          onChange={handleHitPointValue}
          onFocus={handleFocus}
          type="number"
          value={characterData.hp.points}
        />
        <Button
          type="primary"
          onClick={onClick}
          disabled={
            customHitDice === "" &&
            !characterData.class
              .split(" ")
              .some((part) =>
                Object.values(ClassNamesTwo).includes(part as ClassNamesTwo)
              )
          }
        >{`Roll 1${characterData.hp.dice}${characterData.abilities.modifiers.constitution}`}</Button>
      </Space.Compact>
    </>
  );
}
