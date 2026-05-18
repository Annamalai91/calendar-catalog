export const CONTACT_INFO = {
  phoneDisplay: "+91 8939864346",
  phoneDial: "+918939864346",
  phoneDigits: "918939864346",
  email: "annamalaivignesh91@gmail.com",
  instagramUrl: "https://www.instagram.com/annamalaivignesh91/",
  facebookUrl: "https://www.facebook.com/annamalaivignesh91",
} as const;

export const CONTACT_LINKS = {
  call: `tel:${CONTACT_INFO.phoneDial}`,
  whatsapp: `https://wa.me/${CONTACT_INFO.phoneDigits}`,
  instagram: CONTACT_INFO.instagramUrl,
  facebook: CONTACT_INFO.facebookUrl,
  email: `mailto:${CONTACT_INFO.email}`,
} as const;
