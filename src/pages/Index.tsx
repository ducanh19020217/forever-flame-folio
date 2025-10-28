import { useState, useEffect } from "react";
import InvitationEnvelope from "@/components/InvitationEnvelope";
import WeddingContent from "@/components/WeddingContent";

const Index = () => {
  const [showWeddingContent, setShowWeddingContent] = useState(false);
  const [shouldPlayMusic, setShouldPlayMusic] = useState(false);
  const [guestName, setGuestName] = useState("Quý khách");

  useEffect(() => {
    // Get guest name from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get("to");
    if (toParam) {
      setGuestName(decodeURIComponent(toParam));
    }
  }, []);

  if (!showWeddingContent) {
    return (
      <InvitationEnvelope
        guestName={guestName}
        onEnterWeddingPage={() => setShowWeddingContent(true)}
        onStartMusic={() => setShouldPlayMusic(true)}
      />
    );
  }

  return <WeddingContent autoPlayMusic={shouldPlayMusic} />;
};

export default Index;
