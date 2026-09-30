import { useParams, Navigate } from "react-router-dom";
import JourneyForm from "./JourneyForm";
import { findJourney } from "./journeys/data";

export default function JourneyEdit() {
  const { journeyId } = useParams();
  const journey = journeyId ? findJourney(journeyId) : undefined;
  if (!journey) return <Navigate to="/admin/journeys" replace />;
  return (
    <JourneyForm
      mode="edit"
      initial={journey}
      heading={journey.name}
      subLabel="Edit the details, paths, and settings for this journey."
      breadcrumbCurrent="Edit"
    />
  );
}
