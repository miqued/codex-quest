import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CharacterData, CharacterSheetProps } from "../types";
import BaseStats from "./BaseStats";
import { Breadcrumb } from "antd";
import SecondaryStats from "./SecondaryStats";
import Abilities from "./Abilities";
import AttackBonus from "./AttackBonus";
import Movement from "./Movement";
import ArmorClass from "./ArmorClass";
import HitPoints from "./HitPoints";
import SpecialsRestrictions from "./SpecialsRestrictions";
import SavingThrows from "./SavingThrows";
import ExperiencePoints from "./ExperiencePoints";
import Weight from "./Weight";
import Money from "./Money";
import Items from "./Items";
import Weapons from "./Weapons";

export default function CharacterSheet({ user }: CharacterSheetProps) {
  const { uid, id } = useParams();
  const [character, setCharacter] = useState<CharacterData | null>(null);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const characterDocRef = doc(db, `users/${uid}/characters/${id}`);
        const characterSnapshot = await getDoc(characterDocRef);

        if (characterSnapshot.exists()) {
          const characterData = characterSnapshot.data() as CharacterData;
          console.log(characterData);
          setCharacter(characterData);
        } else {
          console.log("Character not found");
        }
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    }

    fetchCharacter();
  }, [uid, id]);

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <Link to="/">Home</Link> },
          { title: character?.name || "" },
        ]}
      />
      {character ? (
        <div>
          <BaseStats character={character} setCharacter={setCharacter} />
          <SecondaryStats character={character} setCharacter={setCharacter} />
          <Abilities character={character} setCharacter={setCharacter} />
          <AttackBonus character={character} setCharacter={setCharacter} />
          <Movement character={character} setCharacter={setCharacter} />
          <ArmorClass character={character} setCharacter={setCharacter} />
          <HitPoints character={character} setCharacter={setCharacter} />
          <SpecialsRestrictions
            character={character}
            setCharacter={setCharacter}
          />
          <SavingThrows character={character} setCharacter={setCharacter} />
          <ExperiencePoints character={character} setCharacter={setCharacter} />
          <Weight character={character} setCharacter={setCharacter} />
          <Money character={character} setCharacter={setCharacter} />
          <Items character={character} setCharacter={setCharacter} />
          <Weapons character={character} setCharacter={setCharacter} />
          {/* weapons */}
          {/* animals */}
          {/* SPELLS */}
          {/* Languages */}
          {/* Notes */}
          {/* initiative w/ RACE/ClASS BONUSES */}
          {/* CLASS TABLE */}
          {/* Hit Dice */}
        </div>
      ) : (
        <div>Loading character...</div>
      )}
    </div>
  );
}
