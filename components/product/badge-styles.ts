const sizeBadgeClassName =
  "border-transparent bg-[#DDF6F2] dark:bg-[#123833] text-[#0F766E] dark:text-[#5eead4] hover:bg-[#CBEDE7] dark:hover:bg-[#184841]";

const getPaperBadgeClassName = (paperType: string) => {
  switch (paperType.trim().toLowerCase()) {
    case "art":
      return "border-transparent bg-[#F5E4DA] dark:bg-[#3d2419] text-[#8A4B32] dark:text-[#f8b499] hover:bg-[#EDD6C8] dark:hover:bg-[#4d2d1f]";
    default:
      return "border-transparent bg-[#F7EBDD] dark:bg-[#3d2e1c] text-[#8C6138] dark:text-[#f3c892] hover:bg-[#EFDEC8] dark:hover:bg-[#4e3b24]";
  }
};

export { getPaperBadgeClassName, sizeBadgeClassName };
