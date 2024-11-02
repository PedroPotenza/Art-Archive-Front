import { Tooltip } from "@nextui-org/tooltip";
import React, { useEffect, useRef, useState } from "react";

interface TruncatedTextWithTooltipProps {
  label: string;
  text: string;
  tooltipContent?: React.ReactNode;
  className?: string;
}

export default function TruncatedTextWithTooltip({
  label,
  text,
  tooltipContent,
  className = ""
}: TruncatedTextWithTooltipProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const { scrollHeight, clientHeight } = textRef.current;
      setIsOverflowing(scrollHeight > clientHeight);
    }
  }, [text]);

  const content = (
    <div className={`flex-col w-fit ${className}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p ref={textRef} className="line-clamp-2">
        {text}
      </p>
    </div>
  );

  const defaultTooltipContent = (
    <div className="px-1 py-2 max-w-[280px]">
      <p className="font-semibold text-lg">{label}</p>
      <p>{text}</p>
    </div>
  );

  return isOverflowing ? (
    <Tooltip
      content={tooltipContent || defaultTooltipContent}
      placement="right"
      showArrow
      delay={0}
      offset={0}
      closeDelay={0}
      classNames={{
        base: ["before:bg-silver-gray-darkest"],
        content: ["py-2 px-4 shadow-xl", "text-almost-white bg-silver-gray-darkest"]
      }}
      motionProps={{
        variants: {
          exit: {
            opacity: 0,
            transition: { duration: 0.1, ease: "easeIn" }
          },
          enter: {
            opacity: 1,
            transition: { duration: 0.15, ease: "easeOut" }
          }
        }
      }}
    >
      {content}
    </Tooltip>
  ) : (
    content
  );
}
