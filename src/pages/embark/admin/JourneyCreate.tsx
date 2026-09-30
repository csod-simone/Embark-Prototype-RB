import JourneyForm from "./JourneyForm";

export default function JourneyCreate() {
  return (
    <JourneyForm
      mode="create"
      heading="Create Journey"
      subLabel="Define the details and settings for a new learning journey, then add the paths that make it up."
      breadcrumbCurrent="Create Journey"
      showAiGenerate
    />
  );
}
