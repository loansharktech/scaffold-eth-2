import { DiscordIcon, GitbookIcon, GithubIcon, TwitterIcon } from "~~/components/common/icons";

export const navTabs = [
  {
    id: "overview",
    label: "Overview",
    route: "/",
  },
  {
    id: "lending",
    label: "Lending",
    route: "/realms/main",
  },
  {
    id: "bridge",
    label: "Bridge",
    route: "/bridge",
  },
];

export const leadingLinks = [
  // {
  //   icon: <UnionIcon></UnionIcon>,
  //   label: "union",
  //   link: "",
  // },
  {
    icon: <GitbookIcon></GitbookIcon>,
    label: "Gitbook",
    link: "https://docs.loanshark.tech",
  },
  {
    icon: <GithubIcon></GithubIcon>,
    label: "Github",
    link: "https://github.com/loansharktechteam",
  },
  {
    icon: <TwitterIcon></TwitterIcon>,
    label: "Twitter",
    link: "https://twitter.com/loansharktech",
  },
  {
    icon: <DiscordIcon></DiscordIcon>,
    label: "Discord",
    link: "https://discord.com/invite/tbSEWQYMKV",
  },
];
