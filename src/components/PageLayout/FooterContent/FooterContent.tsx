import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { version, bfrpgRelease, bfrpgEdition } from "../../../../package.json";

export default function FooterContent({
  className,
}: React.ComponentPropsWithRef<"div">) {
  const FooterContentClassNames = classNames(
    className,
    "[&_*]:text-springWood",
    "[&_a]:text-seaBuckthorn"
  );

  return (
    <div className={FooterContentClassNames}>
      <Typography.Paragraph>
        © {new Date().getFullYear()}{" "}
        <a
          href="https://iamgarrett.com"
          rel="noreferrer noopener"
          target="_blank"
        >
          J. Garrett Vorbeck
        </a>
        . All rights reserved. CODEX.QUEST v{version}
      </Typography.Paragraph>
      <Typography.Paragraph>
        This site is based on the&nbsp;
        <a
          href="https://basicfantasy.org"
          rel="noreferrer noopener"
          target="_blank"
        >
          Basic Fantasy Role-Playing Game
        </a>{" "}
        and is current to {bfrpgEdition} Edition (release {bfrpgRelease}).
      </Typography.Paragraph>
      <div className="grid grid-cols-2 md:flex md:gap-8 md:grid-rows-1">
        <Typography.Paragraph>
          <a
            href="https://github.com/gvorbeck/codex-quest/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer noopener"
          >
            License
          </a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <a href="mailto:me@iamgarrett.com">Contact</a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <a
            href="https://github.com/gvorbeck/codex-quest"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Link to="https://www.freeprivacypolicy.com/live/fbe666aa-8172-4c25-86b3-f8b190191f9c">
            Privacy Policy
          </Link>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Link to="https://www.paypal.com/donate/?business=4BW6AR5BGQZYW&no_recurring=0&item_name=for+CODEX.QUEST+database+fees&currency_code=USD">
            Donate
          </Link>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Link to="https://basicfantasy.org/forums/viewtopic.php?t=4840">
            Forum
          </Link>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Link to="/sources">Sources</Link>
        </Typography.Paragraph>
      </div>
    </div>
  );
}
