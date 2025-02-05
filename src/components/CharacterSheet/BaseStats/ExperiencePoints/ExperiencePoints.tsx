import { Button, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";
import HelpTooltip from "../../../HelpTooltip/HelpTooltip";
import { classes } from "../../../../data/classes";
import {
  CharacterData,
  ClassNames,
  SetCharacterData,
} from "../../../../data/definitions";
import classNames from "classnames";

type ExperiencePointsProps = {
  characterData: CharacterData;
  setCharacterData?: SetCharacterData;
  userIsOwner?: boolean;
  showLevelUpModal?: () => void;
};

export default function ExperiencePoints({
  characterData,
  setCharacterData,
  userIsOwner,
  showLevelUpModal,
  className,
}: ExperiencePointsProps & React.ComponentPropsWithRef<"div">) {
  const [prevValue, setPrevValue] = useState(characterData.xp.toString());

  const [inputValue, setInputValue] = useState(characterData.xp.toString());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const { uid, id } = useParams();
  const updateXP = async () => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    if (characterData.xp.toString() !== prevValue) {
      const docRef = doc(db, "users", uid, "characters", id);

      try {
        await updateDoc(docRef, {
          xp: characterData.xp,
        });
        setPrevValue(characterData.xp.toString());
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const handleInputBlur = () => {
    // Check if inputValue matches the expected format (optional '-' or '+', followed by numeric characters)
    if (!/^[+-]?\d+$/.test(inputValue)) {
      console.error("Invalid input");
      return;
    }

    const newValue = inputValue;
    if (newValue.startsWith("+")) {
      const increment = parseInt(newValue.slice(1));
      if (!isNaN(increment)) {
        const updatedXP = characterData.xp + increment;
        if (setCharacterData) {
          setCharacterData({
            ...characterData,
            xp: updatedXP,
          });
        }
        setInputValue(updatedXP.toString());
      }
    } else if (newValue.startsWith("-")) {
      const decrement = parseInt(newValue.slice(1));
      if (!isNaN(decrement)) {
        const updatedXP = characterData.xp - decrement;
        if (setCharacterData) {
          setCharacterData({
            ...characterData,
            xp: updatedXP,
          });
        }
        setInputValue(updatedXP.toString());
      }
    } else {
      const value = parseInt(newValue);
      if (!isNaN(value)) {
        if (setCharacterData) {
          setCharacterData({
            ...characterData,
            xp: value,
          });
        }
        setInputValue(value.toString());
      }
    }
  };

  const totalLevelRequirement = characterData.class
    .map((className) => {
      const classRequirements =
        classes[className as ClassNames]?.experiencePoints;
      return classRequirements ? classRequirements[characterData.level] : 0; // value if using a custom class
    })
    .reduce((a, b) => a + b, 0);

  useEffect(() => {
    updateXP();
  }, [characterData.xp]);

  const experiencePointsClassNames = classNames("flex", className);

  return (
    <div className={experiencePointsClassNames}>
      <Space.Compact>
        <Input
          value={inputValue}
          onFocus={(event) => event.target.select()}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleInputBlur();
            }
          }}
          suffix={characterData.level < 20 && `/ ${totalLevelRequirement} XP`}
          disabled={!userIsOwner}
          name="Experience Points"
          id="experience-points"
        />
        <label htmlFor="experience-points" className="hidden">
          Experience Points
        </label>
        {characterData.level < 20 && (
          <Button
            disabled={characterData.xp < totalLevelRequirement}
            type="primary"
            onClick={showLevelUpModal}
            className="print:hidden"
          >{`Level Up`}</Button>
        )}
      </Space.Compact>
      <HelpTooltip
        className="ml-4"
        text="You can add to your XP total by highlighting the current value and typing a number starting with _+ or -_ (ex: _+250_) and hitting Enter."
      />
    </div>
  );
}
