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
  Users,
  Mail,
  ArrowUpRight,
} from "lucide-react";

interface RequestQuoteDialogProps {
  productName: string;
}

const contactChannels = [
  {
    label: "Call",
    href: CONTACT_LINKS.call,
    value: CONTACT_INFO.phoneDisplay,
    icon: Phone,
  },
  {
    label: "WhatsApp",
    href: CONTACT_LINKS.whatsapp,
    value: "Quick chat",
    icon: MessageCircle,
  },
  {
    label: "Instagram",
    href: CONTACT_LINKS.instagram,
    value: "Direct message",
    icon: Camera,
  },
  {
    label: "Facebook",
    href: CONTACT_LINKS.facebook,
    value: "Message page",
    icon: Users,
  },
  {
    label: "Email",
    href: CONTACT_LINKS.email,
    value: CONTACT_INFO.email,
    icon: Mail,
  },
] as const;

const RequestQuoteDialog = ({ productName }: RequestQuoteDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 sm:flex-none" size="lg">
          Request a Quote
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl overflow-hidden rounded-2xl border border-black/10 bg-[#F7FBF9] p-0">
        <div className="bg-[linear-gradient(145deg,#ecfdf5_0%,#f0f9ff_40%,#ffffff_100%)] p-6 sm:p-7">
          <DialogHeader>
            <Badge className="w-fit rounded-full border border-black/10 bg-white text-slate-700">
              Quote Support
            </Badge>
            <DialogTitle className="mt-3 text-2xl leading-tight text-slate-950">
              Request a quote for {productName}
            </DialogTitle>
            <DialogDescription className="max-w-md text-slate-600">
              Reach us through any channel below. Contact details are synced
              with the site navbar.
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
                className="group rounded-xl border border-black/10 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#e6f7f3] text-[#0f766e]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {label}
                      </p>
                      <p className="text-xs text-slate-600">{value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-700" />
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
