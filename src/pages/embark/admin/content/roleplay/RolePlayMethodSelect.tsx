import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { PageContainer } from "@/components/embark/layouts/PageContainer";
import { AiFlag } from "@/components/embark/AiFlag";
import { AskSageIcon } from "@/components/embark/AskSageIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RolePlayMethodSelect() {
  const navigate = useNavigate();

  return (
    <PageContainer as="div" className="py-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        onClick={() => navigate("/admin/content")}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Content
      </Button>

      <div>
        <div className="text-xs font-semibold tracking-wide text-muted-foreground">
          NEW ROLE-PLAY
        </div>
        <h2 className="mt-1 text-xl font-semibold text-foreground">Create a Role-Play</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you'd like to build your role-play.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          role="button"
          tabIndex={0}
          onClick={() => navigate("/admin/content/roleplay/new/ai")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/admin/content/roleplay/new/ai")}
          className="p-5 cursor-pointer transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-center justify-between gap-2">
            <AskSageIcon size={20} className="text-primary" />
            <AiFlag />
          </div>
          <h3 className="mt-3 text-base font-semibold text-foreground">Design with AI</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start with a rough description. The assistant will identify gaps and ask one focused
            question at a time.
          </p>
        </Card>

        <Card
          role="button"
          tabIndex={0}
          onClick={() => navigate("/admin/content/roleplay/new/form")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/admin/content/roleplay/new/form")}
          className="p-5 cursor-pointer transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-foreground">Structured Form</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Provide the authoring intent directly across structured fields, then review the
            generated blueprint.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
