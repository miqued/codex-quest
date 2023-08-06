import { List, Typography } from "antd";
import { classDetails } from "../../../data/classDetails";
import { raceDetails } from "../../../data/raceDetails";
import { SpecialsRestrictionsProps } from "./definitions";
console.log("Directly after import:", raceDetails);
// Ant Design's List component treats the input as a string and not as HTML.
// To render HTML, you need to use dangerouslySetInnerHTML prop in React.
// However, List.Item does not support dangerouslySetInnerHTML directly.
// To overcome this, HtmlRender component accepts the HTML string and renders it correctly.
const HtmlRender = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

export default function SpecialsRestrictions({
  characterData,
  className,
}: SpecialsRestrictionsProps) {
  console.log(characterData.class);
  // Split the class string into individual classes
  const individualClasses = characterData.class.split(" ");

  // Gather the specials and restrictions for each class in the combination
  const classSpecials: string[] = [];
  const classRestrictions: string[] = [];
  individualClasses.forEach((cls) => {
    const key = cls as keyof typeof classDetails;
    if (classDetails[key]) {
      classSpecials.push(...classDetails[key].specials);
      classRestrictions.push(...classDetails[key].restrictions);
    }
  });
  console.log(raceDetails, classDetails);

  return (
    <div className={className}>
      <Typography.Title level={3} className="mt-0 !text-shipGray">
        Special Abilities & Restrictions
      </Typography.Title>
      <List
        bordered
        dataSource={[
          ...(raceDetails[characterData.race as keyof typeof raceDetails]
            ?.specials || []),
          ...classSpecials,
          ...(raceDetails[characterData.race as keyof typeof raceDetails]
            ?.specials || []),
          ...classRestrictions,
        ]}
        renderItem={(item) => (
          <List.Item>
            <HtmlRender html={item} />
          </List.Item>
        )}
        className="print:border-0"
        size="small"
      />
    </div>
  );
}
