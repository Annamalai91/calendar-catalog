export const CONTACT_INFO = {
  phoneDisplay: "+91 9843015902",
  phoneDial: "+9843015902",
  phoneDigits: "919843015902",
  email: "vidhyasriprints@gmail.com",
  instagramUrl: "https://www.instagram.com/vidhyasrienterprises/",
} as const;

export const CONTACT_LINKS = {
  call: `tel:${CONTACT_INFO.phoneDial}`,
  whatsapp: `https://wa.me/${CONTACT_INFO.phoneDigits}`,
  instagram: CONTACT_INFO.instagramUrl,
  email: `mailto:${CONTACT_INFO.email}`,
  catalogueDrive: "https://drive.google.com/drive/folders/1X__vL2d3OM6nvygjaZPnrD21auX2K7TB",
} as const;
