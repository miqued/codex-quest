import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import DOMPurify from "dompurify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { PlayerListObject } from "../../../data/definitions";

interface AddPlayerFormProps {
  players: PlayerListObject[];
  setPlayers: (players: PlayerListObject[]) => void;
  gmId: string;
  gameId: string;
}

async function updateGameWithNewPlayer(
  gameId: string,
  userId: string,
  newPlayer: PlayerListObject
) {
  const gameDocRef = doc(db, `users/${userId}/games/${gameId}`);
  const gameDoc = await getDoc(gameDocRef);

  if (gameDoc.exists()) {
    const gameData = gameDoc.data();
    const updatedPlayers = [...(gameData?.players || []), newPlayer];
    await setDoc(gameDocRef, { ...gameData, players: updatedPlayers });
  } else {
    console.error("Game does not exist");
  }
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({
  players = [],
  setPlayers,
  gmId,
  gameId,
}) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const sanitizedURL = DOMPurify.sanitize(values.url);
    const regex = /\/u\/([a-zA-Z0-9]+)\/c\/([a-zA-Z0-9]+)/;
    const match = sanitizedURL.match(regex);

    if (match) {
      const userId = match[1];
      const characterId = match[2];

      const docRef = doc(db, `users/${userId}/characters/${characterId}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const characterData = { user: userId, character: characterId };
        if (Array.isArray(players)) {
          setPlayers([...players, characterData]);
          // Assuming you have the gameId
          updateGameWithNewPlayer(gameId, gmId, characterData);
        } else {
          console.error("Players is not an array:", players);
        }
        message.success("Character added successfully.");
        form.resetFields();
      } else {
        message.error("No such character exists.");
      }
    } else {
      message.error("Invalid URL format.");
    }
  };

  return (
    <Form onFinish={onFinish} form={form}>
      <Form.Item
        name="url"
        rules={[
          {
            required: true,
            message: "Please input a codex.quest character URL.",
          },
        ]}
      >
        <div>
          <Input placeholder="https://codex.quest/u/AsxtzoU61db5IAA6d9IrEFFjh6a2/c/qK3N1Oe0JChp1iWLduqW" />
          <Typography.Text type="secondary" className="text-xs ml-3">
            Enter a codex.quest character URL to add a player's character.
          </Typography.Text>
        </div>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Player
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddPlayerForm;
