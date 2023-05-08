import type { FunctionComponent } from "react";
import { ActionIcon } from "@mantine/core";
import { leadingLinks } from "~~/configs/app";

const Footer: FunctionComponent = () => {
  return (
    <div className="w-full text-dark1 flex gap-5 flex justify-center">
      {leadingLinks.map(link => {
        return (
          <a key={link.label} href={link.link} aria-label={link.label} target="_blank">
            <ActionIcon variant="transparent">{link.icon}</ActionIcon>
          </a>
        );
      })}
    </div>
  );
};

export default Footer;
