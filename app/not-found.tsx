import Link from "next/link";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "lucide-react";
import { APP_TEXT } from "@configs/constants";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">
        {APP_TEXT.notFoundPage.code}
      </h1>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {APP_TEXT.notFoundPage.title}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        {APP_TEXT.notFoundPage.description}
      </p>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {APP_TEXT.notFoundPage.cta}
        </Link>
      </Button>
    </div>
  );
}
