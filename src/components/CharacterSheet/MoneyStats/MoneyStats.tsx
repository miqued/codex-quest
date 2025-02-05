import { Input, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import { CharacterData, SetCharacterData } from "../../../data/definitions";

type MoneyStatsProps = {
  characterData: CharacterData;
  setCharacterData: SetCharacterData;
  userIsOwner: boolean;
  makeChange: () => { gp: number; sp: number; cp: number };
};

export default function MoneyStats({
  characterData,
  setCharacterData,
  userIsOwner,
  makeChange,
  className,
}: MoneyStatsProps & React.ComponentPropsWithRef<"div">) {
  const { gp, sp, cp } = makeChange();
  const [goldValue, setGoldValue] = useState(gp.toString());
  const [silverValue, setSilverValue] = useState(sp.toString());
  const [copperValue, setCopperValue] = useState(cp.toString());

  const { uid, id } = useParams<{ uid: string; id: string }>();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFunc: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setFunc(event.target.value);
  };

  const handleInputBlur = async (
    newValue: string,
    originalValue: number,
    setFunc: React.Dispatch<React.SetStateAction<string>>,
    multiplier: number
  ) => {
    let valueToSet: number = NaN;

    if (newValue.startsWith("+")) {
      const increment = parseInt(newValue.slice(1));
      if (!isNaN(increment)) {
        valueToSet = originalValue + increment;
      }
    } else if (newValue.startsWith("-")) {
      const decrement = parseInt(newValue.slice(1));
      if (!isNaN(decrement)) {
        valueToSet =
          originalValue - decrement >= 0 ? originalValue - decrement : 0;
      }
    } else {
      const value = parseInt(newValue);
      if (!isNaN(value) && value >= 0) {
        valueToSet = value;
      }
    }

    if (!isNaN(valueToSet) && setCharacterData) {
      setFunc(valueToSet.toString());
      setCharacterData({
        ...characterData,
        gold: characterData.gold + (valueToSet - originalValue) / multiplier,
      });

      await updateMoney(
        characterData.gold + (valueToSet - originalValue) / multiplier
      );
    }
  };

  const updateMoney = async (gold: number) => {
    if (!uid || !id) {
      console.error("User ID or Character ID is undefined");
      return;
    }

    const docRef = doc(db, "users", uid, "characters", id);

    try {
      await updateDoc(docRef, {
        gold,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const { gp, sp, cp } = makeChange();

    setGoldValue(gp.toString());
    setSilverValue(sp.toString());
    setCopperValue(cp.toString());
  }, [characterData.gold]);

  return (
    <div className={`${className}`}>
      <div className="flex items-baseline justify-start">
        <Typography.Title
          level={3}
          className="mt-0 text-shipGray text-center sm:text-left"
        >
          Money
        </Typography.Title>
        <HelpTooltip
          className="ml-2"
          text={`You can manage your coin totals by highlighting the current value and typing a number starting with _+ or -_ (ex: _+2_) to add 2 of the coin-type to your total and hitting Enter.\n\nCoins are automatically reorganized on refresh (10 sp will become 1gp).`}
        />
      </div>
      <Space
        direction="vertical"
        className="w-full items-center sm:items-start"
      >
        {[
          ["gp", goldValue, setGoldValue, 1],
          ["sp", silverValue, setSilverValue, 10],
          ["cp", copperValue, setCopperValue, 100],
        ].map(([key, value, setFunc, multiplier]) => (
          <React.Fragment key={key as string}>
            <Input
              min={0}
              value={value as string}
              name={key as string}
              onFocus={(event) => event.target.select()}
              onChange={(event) =>
                handleInputChange(
                  event,
                  setFunc as React.Dispatch<React.SetStateAction<string>>
                )
              }
              onBlur={() =>
                handleInputBlur(
                  value as string,
                  (makeChange() as { [key: string]: number })[
                    key as "gp" | "sp" | "cp"
                  ],
                  setFunc as React.Dispatch<React.SetStateAction<string>>,
                  multiplier as number
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleInputBlur(
                    value as string,
                    (makeChange() as { [key: string]: number })[
                      key as "gp" | "sp" | "cp"
                    ],
                    setFunc as React.Dispatch<React.SetStateAction<string>>,
                    multiplier as number
                  );
                }
              }}
              addonAfter={key as string}
              disabled={!userIsOwner}
              id={key as string}
            />
            <label htmlFor={key as string} className="hidden">
              {key as string}
            </label>
          </React.Fragment>
        ))}
      </Space>
    </div>
  );
}
