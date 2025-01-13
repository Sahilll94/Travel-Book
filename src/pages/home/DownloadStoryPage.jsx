import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import domtoimage from "dom-to-image"; // Import dom-to-image for capturing the DOM as an image
import backgroundImage from "../../../src/assets/images/bg-share.png"; // Import background image

function DownloadStoryPage() {
  const { id } = useParams(); // Get the ID from the URL
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storyRef = useRef(); // Reference for the story box

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

  const handleDownload = () => {
    const node = storyRef.current;
    domtoimage.toPng(node)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${story.title}-instagram-story.png`;
        link.click();
      })
      .catch(function (error) {
        console.error("Error capturing image:", error);
      });
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
      <StoryBox ref={storyRef} bgImage={backgroundImage}>
        <TitleText>{story.title}</TitleText>
        <StoryImage src={story.imageUrl} alt={`Image for ${story.title}`} />
        <StoryText>{story.story}</StoryText>
        <VisitedText>
          <strong>Visited Locations:</strong> {story.visitedLocation.join(", ")}
        </VisitedText>
      </StoryBox>
      <DownloadButton onClick={handleDownload}>Download as Instagram Story</DownloadButton>
    </StoryContainer>
  );
}

export default DownloadStoryPage;

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
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  width: 100%;
  max-width: 600px;
  position: relative;
  background-image: url(${(props) => props.bgImage || "default_bg.png"});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 90vh;
  aspect-ratio: 9 / 16;  /* Ensuring aspect ratio for Instagram story */
`;

const TitleText = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const StoryImage = styled.img`
  width: 100%;
  height: auto;
  margin: 20px 0;
`;

const StoryText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const VisitedText = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const DownloadButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: absolute;
  bottom: 20px;  /* Ensures the button is placed at the bottom */
  left: 50%;
  transform: translateX(-50%);
  width: 80%;  /* Make the button more prominent */

  &:hover {
    background-color: #45a049;
  }

  &:active {
    transform: scale(0.95);
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
