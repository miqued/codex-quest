import { Button, Input, Tooltip, Typography } from "antd";
import { useEffect, useState, useRef, ReactNode, FC } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import {
  CharacterDescriptionProps,
  DescriptionFieldButtonProps,
} from "./definitions";
import DOMPurify from "dompurify";
import { ClassNames } from "../../definitions";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";

export default function Description({
  characterData,
  setCharacterData,
  userIsOwner,
}: CharacterDescriptionProps) {
  if (typeof characterData.desc === "string") {
    setCharacterData({
      ...characterData,
      desc: [characterData.desc],
    });
  }

  const DescriptionFieldButton: FC<DescriptionFieldButtonProps> = ({
    handler,
    icon,
    className,
  }) => {
    const buttonClassNames = classNames("absolute", "left-0", className);
    return (
      <Tooltip title="Add text field" className={buttonClassNames}>
        <Button type="primary" shape="circle" icon={icon} onClick={handler} />
      </Tooltip>
    );
  };

  const handleAddDescriptionField = () => {
    setCharacterData({
      ...characterData,
      desc: [...characterData.desc, ""],
    });
  };

  const handleDeleteDescriptionField = (index: number) => {
    // remove the description field at the given index
    let newDescription = characterData.desc;
    if (typeof characterData.desc === "object") {
      newDescription = characterData.desc.filter(
        (_: string, i: number) => i !== index
      );
    }
    setCharacterData({
      ...characterData,
      desc: newDescription,
    });
  };

  return (
    <div>
      <div className="flex items-baseline gap-4">
        <Typography.Title level={3} className="mt-0 !text-shipGray">
          Bio & Notes
        </Typography.Title>
        {!Object.values(ClassNames).includes(
          characterData.class as ClassNames
        ) && (
          <HelpTooltip
            text={`You can clear this field to restore the "${characterData.class}" Saving Throws template.`}
          />
        )}
      </div>
      <div className="grid gap-4">
        {typeof characterData.desc === "object" &&
          characterData.desc.map((desc: string, index: number) => {
            return (
              <div className="relative pl-12">
                {index > 0 && (
                  <DescriptionFieldButton
                    handler={() => handleDeleteDescriptionField(index)}
                    icon={<MinusCircleOutlined />}
                  />
                )}
                {index === characterData.desc.length - 1 && index < 9 && (
                  <DescriptionFieldButton
                    handler={handleAddDescriptionField}
                    icon={<PlusCircleOutlined />}
                    className={index > 0 ? "top-12" : ""}
                  />
                )}
                <Input.TextArea
                  key={index}
                  value={desc}
                  rows={10}
                  name="Bio & Notes"
                  placeholder={`Write anything and everything about ${characterData.name}`}
                  // onChange={handleInputChange}
                  // onBlur={updateDescription}
                  disabled={!userIsOwner}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
  //   const [inputValue, setInputValue] = useState(characterData.desc || "");
  //   const { uid, id } = useParams();
  //   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  //   const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //     const cleanInput = DOMPurify.sanitize(event.target.value);
  //     setInputValue(cleanInput);
  //   };

  //   if (
  //     inputValue === "" &&
  //     !Object.values(ClassNames).includes(
  //       characterData.class.split(" ")[0] as ClassNames
  //     )
  //   ) {
  //     const placeholderSavingThrows = `"${characterData.class}" SAVING THROWS\n----------\nDEATH RAY or POISON: 00\nMAGIC WANDS: 00\nPARALYSIS or PETRIFY: 00\nDRAGON BREATH: 00\nSPELLS: 00`;
  //     setInputValue(placeholderSavingThrows);
  //   }

  //   const updateDescription = async () => {
  //     if (!uid || !id) {
  //       console.error("User ID or Character ID is undefined");
  //       return;
  //     }

  //     if (characterData.desc !== inputValue) {
  //       const docRef = doc(db, "users", uid, "characters", id);
  //       try {
  //         await updateDoc(docRef, {
  //           desc: inputValue,
  //         });
  //         setCharacterData({
  //           ...characterData,
  //           desc: inputValue,
  //         });
  //       } catch (error) {
  //         console.error("Error updating document: ", error);
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //     timeoutRef.current = setTimeout(updateDescription, 5000);
  //     return () => {
  //       if (timeoutRef.current) {
  //         clearTimeout(timeoutRef.current);
  //       }
  //     };
  //   }, [inputValue]);

  //   return (
  //     <div>
  //       <div className="flex items-baseline gap-4">
  //         <Typography.Title level={3} className="mt-0 !text-shipGray">
  //           Bio & Notes
  //         </Typography.Title>
  //         {!Object.values(ClassNames).includes(
  //           characterData.class as ClassNames
  //         ) && (
  //           <HelpTooltip
  //             text={`You can clear this field to restore the "${characterData.class}" Saving Throws template.`}
  //           />
  //         )}
  //       </div>
  //       <Tooltip title="search">
  //         <Button type="primary" shape="circle" icon={<PlusCircleOutlined />} />
  //       </Tooltip>
  //       <Input.TextArea
  //         value={inputValue}
  //         rows={10}
  //         name="Bio & Notes"
  //         placeholder={`Write anything and everything about ${characterData.name}`}
  //         onChange={handleInputChange}
  //         onBlur={updateDescription}
  //         disabled={!userIsOwner}
  //       />
  //     </div>
  //   );
}
