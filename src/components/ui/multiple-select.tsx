"use client";

import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export type TTag = {
  key: string;
  name: string;
};

type MultipleSelectProps = {
  tags: TTag[];
  customTag?: (item: TTag) => ReactNode | string;
  onChange?: (value: TTag[]) => void;
  defaultValue?: TTag[];
};

export const MultipleSelect = ({
  tags,
  customTag,
  onChange,
  defaultValue,
}: MultipleSelectProps) => {
  console.log("MultipleSelect: Initializing with defaultValue:", defaultValue);
  const [selected, setSelected] = useState<TTag[]>(defaultValue ?? []);
  const containerRef = useRef<HTMLDivElement>(null);

  const onValueChange = useCallback(
    (value: TTag[]) => {
      console.log("MultipleSelect: Value changed:", value);
      onChange?.(value);
    },
    [onChange]
  );

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
    onValueChange(selected);
  }, [selected, onValueChange]);

  const handleSelect = (item: TTag) => {
    console.log("MultipleSelect: Selecting tag:", item);
    setSelected((prev) => [...prev, item]);
  };

  const handleDeselect = (item: TTag) => {
    console.log("MultipleSelect: Deselecting tag:", item);
    setSelected((prev) => prev.filter((i) => i.key !== item.key));
  };

  return (
    <AnimatePresence mode="popLayout">
      <div className="flex w-[450px] flex-col gap-2">
        <motion.div
          layout
          ref={containerRef}
          className={cn(
            "selected no-scrollbar flex h-12 w-full items-center overflow-x-scroll scroll-smooth rounded-md border border-input bg-background p-2 transition-colors hover:border-primary"
          )}
        >
          <motion.div layout className="flex items-center gap-2">
            {selected.map((item) => (
              <Tag
                name={item.key}
                key={item.key}
                className="bg-accent text-accent-foreground shadow"
              >
                <div className="flex items-center gap-2">
                  <motion.span layout className="text-nowrap">
                    {item.name}
                  </motion.span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeselect(item);
                    }}
                    className="hover:text-destructive"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </Tag>
            ))}
          </motion.div>
        </motion.div>
        {tags.length > selected.length && (
          <div className="flex w-full flex-wrap gap-2 rounded-md border border-input bg-background p-2">
            {tags
              .filter((item) => !selected.some((i) => i.key === item.key))
              .map((item) => (
                <Tag
                  name={item.key}
                  onClick={() => handleSelect(item)}
                  key={item.key}
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  {customTag ? (
                    customTag(item)
                  ) : (
                    <motion.span layout className="text-nowrap">
                      {item.name}
                    </motion.span>
                  )}
                </Tag>
              ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

type TagProps = PropsWithChildren &
  Pick<HTMLAttributes<HTMLDivElement>, "onClick"> & {
    name?: string;
    className?: string;
  };

export const Tag = ({ children, className, name, onClick }: TagProps) => {
  return (
    <motion.div
      layout
      layoutId={name}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
