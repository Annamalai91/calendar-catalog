import Image from "next/image";

/**
 * Official WhatsApp Brand Asset
 */
export const WhatsAppIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <Image
    src="/assets/whatsapp.svg"
    alt="WhatsApp"
    width={24}
    height={24}
    className={`object-contain scale-[1.2] origin-center ${className}`}
  />
);

/**
 * Official Instagram Brand Asset
 */
export const InstagramIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <Image
    src="/assets/instagram.svg"
    alt="Instagram"
    width={24}
    height={24}
    className={`object-contain ${className}`}
  />
);

/**
 * Official Gmail Brand Asset (Google Workspace Gmail Logo)
 */
export const GmailIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <Image
    src="/assets/gmail.svg"
    alt="Gmail"
    width={24}
    height={24}
    className={`object-contain ${className}`}
  />
);

/**
 * Official Phone Call Icon Asset
 */
export const PhoneCallIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <Image
    src="/assets/phone.svg"
    alt="Phone Call"
    width={24}
    height={24}
    className={`object-contain ${className}`}
  />
);
