import { Typography } from "@/ui/design-system/typography";

export interface ProseBlocksProps {
  text: string;
}

export function ProseBlocks({ text }: ProseBlocksProps) {
  const paragraphs = text.split("\n\n").filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <Typography key={paragraph.slice(0, 24)} variant="body">
          {paragraph}
        </Typography>
      ))}
    </div>
  );
}
