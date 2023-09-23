import { CharacterData } from "../../definitions";
import { EquipmentItem } from "../definitions";

export interface EquipmentAccordionProps {
  characterData: CharacterData;
  onAmountChange: (item?: EquipmentItem) => void;
  onCheckboxCheck: (item?: EquipmentItem) => void;
  onRadioCheck: (item?: EquipmentItem) => void;
}
