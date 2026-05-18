const sizeBadgeClassName =
  "border-transparent bg-[#DDF6F2] text-[#0F766E] hover:bg-[#CBEDE7]";

const getPaperBadgeClassName = (paperType: string) => {
  switch (paperType.trim().toLowerCase()) {
    case "art":
      return "border-transparent bg-[#F5E4DA] text-[#8A4B32] hover:bg-[#EDD6C8]";
    default:
      return "border-transparent bg-[#F7EBDD] text-[#8C6138] hover:bg-[#EFDEC8]";
  }
};

export { getPaperBadgeClassName, sizeBadgeClassName };
