import { Button, Col, Empty, Row, Spin, Typography } from "antd";
import { useNavigate, useOutletContext } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import classNames from "classnames";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import { images } from "../../assets/images/faces/imageAssets";
import { extractImageName } from "../../support/stringSupport";
import { CharacterData } from "../../data/definitions";
import { User } from "firebase/auth";
import { UserAddOutlined } from "@ant-design/icons";

export default function CharacterList({
  user,
  className,
}: { user: User | null } & React.ComponentPropsWithRef<"div">) {
  const outletContext = useOutletContext() as { className: string };
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        if (user) {
          const uid = user.uid;
          const charactersCollectionRef = collection(
            db,
            `users/${uid}/characters`
          );

          // Listen to real-time updates
          const unsubscribe = onSnapshot(
            charactersCollectionRef,
            (snapshot) => {
              const userCharacters = snapshot.docs.map((doc) => {
                const data = doc.data() as CharacterData;
                data.id = doc.id;
                return data;
              });
              setCharacters(userCharacters);
              document.title = `CODEX.QUEST`;
              setLoading(false);
            }
          );

          // Return the unsubscribe function to clean up the listener
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      }
    };

    // Call the fetchCharacters function when the component mounts
    fetchCharacters();
  }, [user]);

  const confirm = async (characterId: string) => {
    if (user) {
      const characterDoc = doc(
        db,
        `users/${user.uid}/characters/${characterId}`
      );
      await deleteDoc(characterDoc);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [characters]);

  const characterListClassNames = classNames(
    outletContext.className,
    className,
    "text-shipGray",
    "[&>*+*]:mt-4"
  );

  return (
    <div className={characterListClassNames}>
      <div className="flex gap-4 items-center">
        <Typography.Title
          level={2}
          className="m-0 font-enchant text-5xl tracking-wider text-shipGray"
        >
          Characters
        </Typography.Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => navigate(`/create`)}
        >
          New Character
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : characters.length > 0 ? (
        <Row justify={"start"} gutter={32} className="gap-y-9">
          {characters
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((characterData) => {
              // Legacy characters created while the site was using Create React App will have broken image links that start with "/static/media/"
              // This code checks for that and replaces the broken link with the correct one
              let image = "";
              if (characterData.avatar.startsWith("/static/media/")) {
                const legacyImage = extractImageName(characterData.avatar);
                if (legacyImage) {
                  // find the matching source images in `images`
                  // "/src/assets/images/faces/gnome-boy-1.jpg" matches gnome-boy-1
                  image =
                    images.find((image) => image.includes(legacyImage)) || "";
                }
              } else {
                image = characterData.avatar;
              }
              return (
                <Col xs={24} md={12} lg={6} key={characterData.id}>
                  <CharacterCard
                    characterData={characterData}
                    user={user}
                    image={image}
                    confirm={confirm}
                  />
                </Col>
              );
            })}
        </Row>
      ) : (
        <Empty description="Create your first character by clicking the button above." />
      )}
    </div>
  );
}
