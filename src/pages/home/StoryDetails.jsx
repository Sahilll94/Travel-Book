import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components"; // Import styled-components
import html2canvas from "html2canvas"; // Import html2canvas
import backgroundImage from "../../../src/assets/images/bg-share.png"; // Import background image
import { Helmet } from "react-helmet"; // Import react-helmet
import { toast, Toaster } from 'sonner'; // Import Sonner
import { FaInstagram } from "react-icons/fa"; // Import Instagram icon

function StoryDetails() {
  const { id } = useParams(); // Get the ID from the URL
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storyRef = useRef(); // Create a ref for the story box  

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`https://travel-book-backend.onrender.com/api/story/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStory(data);
        toast.success("Story details loaded successfully.");
      } catch (error) {
        console.error("Error fetching story details:", error);
        setError("Error fetching story details.");
        toast.error("Failed to fetch story details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleDownload = async () => {
    try {
      if (storyRef.current) {
        const canvas = await html2canvas(storyRef.current, {
          allowTaint: true,
          useCORS: true,
          width: 1080,
          height: 1920,
          scale: 2,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${story.title}.png`;
        link.click();
        toast.success("Image downloaded successfully.");
      }
    } catch (error) {
      console.error("Error generating canvas:", error);
      toast.error("Failed to generate image.");
    }
  };

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!story) {
    return <ErrorMessage>No story found.</ErrorMessage>;
  }

  return (
    <>
      {/* Toast notifications */}
      <Toaster position="top-right" richColors />

      {/* Update meta tags only when story data is available */}
      <Helmet>
        <title>{story.title} | Travel Book</title>
        <meta property="og:title" content="The memories are shared with you." />
        <meta property="og:image" content={story.imageUrl} />
        <meta property="og:description" content={story.story} />
        <meta property="og:url" content={`https://travelbook.sahilfolio.live/story/${id}`} />
      </Helmet>

      <StoryContainer>
        <StoryBox ref={storyRef} bgImage={backgroundImage}>
          <StoryTitle>{story.title}</StoryTitle>
          <StoryDate>{new Date(story.createdOn).toLocaleDateString()}</StoryDate>
          <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
          <StoryContent>{story.story}</StoryContent>
          <VisitedLocations>
            <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
          </VisitedLocations>
          <CreateStoryMessage>
            Create your own travel story from <a href="https://travelbook.sahilfolio.live/">https://travelbook.sahilfolio.live/</a>
          </CreateStoryMessage>
        </StoryBox>
        
        {/* Share on Instagram Button */}
        <ShareButton onClick={handleDownload}>
          <FaInstagram /> Share it on your Instagram Story by downloading it!
        </ShareButton>
      </StoryContainer>
    </>
  );
}

export default StoryDetails;

// Styled-components for styling inside the file

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const StoryBox = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  width: 1080px;
  height: auto;
  margin: 20px;
  background-image: url(${(props) => props.bgImage || "default_bg.png"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  position: relative;

  @media (max-width: 1080px) {
    width: 90%;
  }
  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
  }
  @media (max-width: 480px) {
    width: 100%;
    padding: 10px;
  }
`;

const CreateStoryMessage = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #555;
  margin-top: 15px;
  text-align: center;
  width: 100%;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const StoryTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
  margin-top: 10px;
`;

const StoryDate = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 12px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
`;

const StoryImage = styled.img`
  width: 80%;
  max-width: 800px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  object-fit: contain;
`;

const StoryContent = styled.p`
  font-size: 1.3rem;
  font-weight: normal;
  color: #000;
  line-height: 1.5;
  margin-bottom: 15px;
  max-width: 90%;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const VisitedLocations = styled.p`
  font-size: 1.3rem;
  font-weight: normal;
  color: #000;
  max-width: 90%;
  word-wrap: break-word;
  margin-top: 15px;
`;

// New Share Button with Instagram Logo
const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #e1306c;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: background 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #c13584;
  }

  svg {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: red;
  text-align: center;
`;

const Loading = styled.div`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;

