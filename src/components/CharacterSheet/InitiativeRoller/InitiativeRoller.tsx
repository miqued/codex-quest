import { Button, Tooltip, notification } from "antd";
import { DiceRoller } from "@dice-roller/rpg-dice-roller";
import CloseIcon from "../../CloseIcon/CloseIcon";
import { CharacterData, RaceNames } from "../../../data/definitions";
import { NodeIndexOutlined } from "@ant-design/icons";

type InitiativeRollerProps = {
  characterData: CharacterData;
  buttonTextClassNames: string;
};

export default function InitiativeRoller({
  characterData,
  buttonTextClassNames,
}: InitiativeRollerProps) {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (result: number) => {
    api.open({
      message: "Initiative Roll",
      description: result,
      duration: 0,
      className: "!bg-seaBuckthorn",
      closeIcon: <CloseIcon />,
    });
  };

  const rollTooltip = `1d6 + DEX modifier ${
    characterData.race === RaceNames.HALFLING
      ? `+ 1 as a ${RaceNames.HALFLING}`
      : ""
  }`;

  const roller = new DiceRoller();

  const rollInitiative = () => {
    let result = roller.roll(
      `1d6${characterData.abilities.modifiers.dexterity}${
        characterData.race === RaceNames.HALFLING ? "+1" : ""
      }`
    );
    if (result.total === 0) result = 1;
    openNotification(result.output);
  };

  return (
    <>
      {contextHolder}
      <Tooltip title={rollTooltip}>
        <Button type="primary" onClick={rollInitiative}>
          <NodeIndexOutlined />
          <span className={buttonTextClassNames}>Roll Initiative</span>
        </Button>
      </Tooltip>
    </>
  );
}
