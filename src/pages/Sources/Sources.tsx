import { List, Typography } from "antd";
import classNames from "classnames";
import { useOutletContext } from "react-router-dom";

export default function Sources() {
  const outletContext = useOutletContext() as { className: string };
  const sourcesClassNames = classNames(outletContext.className);
  return (
    <div className={sourcesClassNames}>
      <Typography.Title level={3}>Sources</Typography.Title>
      <Typography.Paragraph>
        This site could not exist without the awesome work of so many talented
        people dedicated to open source gaming. Here are the sources that have
        been used to create the content for this site:
      </Typography.Paragraph>
      <List className="italic">
        <List.Item>
          Gonnerman, Chris. "Basic Fantasy Role-Playing Game Core Rules 4th
          Edition." Basic Fantasy Role-Playing Game, 2023,
          basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Hoyt, Tom. "Basic Fantasy Role-Playing Game Beginner's Essentials."
          Basic Fantasy Role-Playing Game, 2023,
          basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Ludlum, et al. "The Basic Fantasy Equipment Emporium." Basic Fantasy
          Role-Playing Game, 2023, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Medders, et al. "Assassins: A Basic Fantasy Supplement." Basic Fantasy
          Role-Playing Game, 2023, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Castellani, Luigi. "Barbarians: A Basic Fantasy Supplement." Basic
          Fantasy Role-Playing Game, 2023, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Gonnerman, et al. "Druids: A Basic Fantasy Supplement." Basic Fantasy
          Role-Playing Game, 2022, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Gonnerman, et al. "Illusionists: A Basic Fantasy Supplement." Basic
          Fantasy Role-Playing Game, 2023, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Gonnerman, Chris. "Gnomes: A Basic Fantasy Supplement." Basic Fantasy
          Role-Playing Game, 2023, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Gonnerman, Chris. "Half Humans: A Basic Fantasy Supplement." Basic
          Fantasy Role-Playing Game, 2023, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Smoot, et al. "Necromancers: A Basic Fantasy Supplement." Basic
          Fantasy Role-Playing Game, 2021, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Gonnerman, et al. "Rangers and Paladins: A Basic Fantasy Supplement."
          Basic Fantasy Role-Playing Game, 2021,
          basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Brentlinger, Jason. "Scouts: A Basic Fantasy RPG Supplement." Basic
          Fantasy Role-Playing Game, 2018, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Castellani, et al. "Spellcrafters: A Basic Fantasy RPG Supplement."
          Basic Fantasy Role-Playing Game, 2023,
          basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>
          Smoot, R. Kevin. "New Races: A Basic Fantasy RPG Supplement." Basic
          Fantasy Role-Playing Game, 2018, basicfantasy.org/downloads.html.
        </List.Item>
        <List.Item>Spiked dragon head icon by Delapouite</List.Item>
      </List>
    </div>
  );
}
