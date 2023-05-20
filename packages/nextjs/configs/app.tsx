import { DiscordIcon, GitbookIcon, GithubIcon, TwitterIcon, UnionIcon } from "~~/components/common/icons";

export const navTabs = [
  {
    id: "leading",
    label: "Leading",
    route: "/",
  },
  {
    id: "contract",
    label: "Contract",
    route: "/lending",
  },
];

export const leadingLinks = [
  {
    icon: <UnionIcon></UnionIcon>,
    label: "union",
    link: "",
  },
  {
    icon: <GitbookIcon></GitbookIcon>,
    label: "Gitbook",
    link: "",
  },
  {
    icon: <GithubIcon></GithubIcon>,
    label: "Github",
    link: "",
  },
  {
    icon: <TwitterIcon></TwitterIcon>,
    label: "Twitter",
    link: "",
  },
  {
    icon: <DiscordIcon></DiscordIcon>,
    label: "Discord",
    link: "",
  },
];
