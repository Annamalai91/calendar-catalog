"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { CONTACT_INFO, CONTACT_LINKS } from "@/configs/contact";
import {
  Phone,
  MessageCircle,
  Camera,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { APP_TEXT } from "@configs/constants";

interface RequestQuoteDialogProps {
  productName: string;
}

const contactChannels = [
  {
    label: APP_TEXT.navbar.contactLinkLabels.call,
    href: CONTACT_LINKS.call,
    value: CONTACT_INFO.phoneDisplay,
    icon: Phone,
  },
  {
    label: APP_TEXT.navbar.contactLinkLabels.whatsapp,
    href: CONTACT_LINKS.whatsapp,
    value: APP_TEXT.requestQuote.values.whatsapp,
    icon: MessageCircle,
  },
  {
    label: APP_TEXT.navbar.contactLinkLabels.instagram,
    href: CONTACT_LINKS.instagram,
    value: APP_TEXT.requestQuote.values.instagram,
    icon: Camera,
  },
  {
    label: APP_TEXT.navbar.contactLinkLabels.email,
    href: CONTACT_LINKS.email,
    value: CONTACT_INFO.email,
    icon: Mail,
  },
] as const;

const RequestQuoteDialog = ({ productName }: RequestQuoteDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 py-3 sm:py-0 sm:flex-none" size="lg">
          {APP_TEXT.requestQuote.trigger}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-[#F7FBF9] dark:bg-[#121215] p-0">
        <div className="bg-[linear-gradient(145deg,#ecfdf5_0%,#f0f9ff_40%,#ffffff_100%)] dark:bg-[linear-gradient(145deg,#121215_0%,#18181b_50%,#27272a_100%)] p-6 sm:p-7">
          <DialogHeader>
            <Badge className="w-fit rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              {APP_TEXT.requestQuote.badge}
            </Badge>
            <DialogTitle className="mt-3 text-2xl leading-tight text-slate-950 dark:text-slate-100">
              {APP_TEXT.requestQuote.titlePrefix} {productName}
            </DialogTitle>
            <DialogDescription className="max-w-md text-slate-600 dark:text-slate-300">
              {APP_TEXT.requestQuote.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-7">
          {contactChannels.map(({ label, href, value, icon: Icon }) => {
            const opensNewTab = href.startsWith("http");

            return (
              <a
                key={label}
                href={href}
                target={opensNewTab ? "_blank" : undefined}
                rel={opensNewTab ? "noreferrer" : undefined}
                className="group cursor-pointer rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#18181B] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#e6f7f3] dark:bg-[#1F2937] text-[#0f766e] dark:text-[#5eead4]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-950 dark:text-slate-100">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                </div>
              </a>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestQuoteDialog;
