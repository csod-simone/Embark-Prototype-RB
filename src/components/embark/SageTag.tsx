import { AiFlag, type AiFlagProps } from "@/components/embark/AiFlag";

/**
 * Shared AI/Sage indicator. Renders the canonical AI flag
 * (see AiFlag) so every instance across the prototype is identical.
 */
export function SageTag(props: AiFlagProps) {
  return <AiFlag {...props} />;
}
