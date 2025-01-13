import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import html2canvas from "html2canvas";

function StoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storyRef = useRef();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`https://travel-book-backend.onrender.com/api/story/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStory(data);
      } catch (error) {
        console.error("Error fetching story details:", error);
        setError("Error fetching story details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleDownload = async () => {
    try {
      if (storyRef.current) {
        // Capture the image with html2canvas
        const canvas = await html2canvas(storyRef.current, {
          allowTaint: true,
          useCORS: true,
          width: storyRef.current.offsetWidth, // Use actual element width
          height: storyRef.current.offsetHeight, // Use actual element height
          scale: 2,
          x: 0,
          y: 0,
          backgroundColor: null, // Transparent background
        });

        // Create a link to download the captured canvas as an image
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${story.title}.png`;
        link.click();
      }
    } catch (error) {
      console.error("Error generating canvas:", error);
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
    <StoryContainer>
      <StoryBox ref={storyRef}>
        <StoryTitle>{story.title}</StoryTitle>
        <StoryDate>{new Date(story.createdOn).toLocaleDateString()}</StoryDate>
        <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
        <StoryContent>{story.story}</StoryContent>
        <VisitedLocations>
          <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
        </VisitedLocations>
      </StoryBox>
      <DownloadButton onClick={handleDownload}>
        Click here to download image as PNG
      </DownloadButton>
    </StoryContainer>
  );
}

export default StoryDetails;

// Styled-components for styling

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const StoryBox = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1080px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  position: relative; /* To maintain a good positioning for capturing */
  
  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const StoryTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
`;

const StoryDate = styled.p`
  font-size: 1rem;
  color: #000;
  margin-bottom: 12px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
`;

const StoryImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  object-fit: cover; /* This makes sure the image fills the width and maintains aspect ratio */
  
  @media (max-width: 480px) {
    width: 100%;
    height: auto;
  }
`;

const StoryContent = styled.p`
  font-size: 1rem;
  color: #000;
  line-height: 1.5;
  margin-bottom: 15px;
  max-width: 90%;
  word-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const VisitedLocations = styled.p`
  font-size: 1rem;
  color: #000;
  max-width: 90%;
  word-wrap: break-word;
`;

const DownloadButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
  }
`;

const Loading = styled.div`
  font-size: 1.5rem;
  color: #333;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: red;
`;

