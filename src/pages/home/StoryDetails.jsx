import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components"; // Import styled-components
import html2canvas from "html2canvas"; // Import html2canvas
import backgroundImage from "../../../src/assets/images/bg-share.png"; // Import background image

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
        const canvas = await html2canvas(storyRef.current, {
          allowTaint: true, // Allow cross-origin images to be captured
          useCORS: true, // Use CORS for loading images
          width: 1080, // Set width to 1080px for Instagram story size
          height: 1920, // Set height to 1920px for Instagram story size
          scale: 2, // Optional: Set higher scale for better image quality
        });

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
      <StoryBox ref={storyRef} bgImage={backgroundImage}>
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
      <ShareText>
        <strong>Create your own story via <a href="https://travelbook.sahilportfolio.me/" target="_blank" rel="noopener noreferrer">https://travelbook.sahilportfolio.me/</a></strong>
      </ShareText>
    </StoryContainer>
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
  width: 1080px; /* Set width to 1080px */
  height: 1920px; /* Set height to 1920px for Instagram story */
  margin: 20px;
  background-image: url(${(props) => props.bgImage || "default_bg.png"}); /* Use the imported background image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centering content vertically */
  align-items: center; /* Centering content horizontally */
  text-align: center; /* Center the text */
  padding: 0 20px;
`;

const StoryTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #000; /* Change text color to black */
  margin-bottom: 8px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4); /* Add shadow for better text readability */
  margin-top: 10px;
`;

const StoryDate = styled.p`
  font-size: 1rem;
  color: #000; /* Change text color to black */
  margin-bottom: 12px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
`;

const StoryImage = styled.img`
  width: 80%; /* Reduced the width of the image */
  max-width: 800px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for image */
  object-fit: contain; /* Ensure the image stays within bounds */
`;

const StoryContent = styled.p`
  font-size: 1.1rem;
  color: #000; /* Change text color to black */
  line-height: 1.5;
  margin-bottom: 15px;
  max-width: 90%; /* Prevent the text from overflowing */
  word-wrap: break-word;
`;

const VisitedLocations = styled.p`
  font-size: 1.1rem;
  color: #000; /* Change text color to black */
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

const ShareText = styled.p`
  font-size: 1.2rem;
  color: #000; /* Change text color to black */
  margin-top: 30px;
  text-align: center;

  strong {
    font-weight: bold;
  }

  a {
    color: #000;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
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

// Media Queries for Responsiveness

const media = {
  small: `(max-width: 1080px)`,
  tablet: `(max-width: 768px)`,
  mobile: `(max-width: 480px)`,
};

const StoryBoxResponsive = styled(StoryBox)`
  @media ${media.small} {
    width: 90%;
    height: auto; /* Let it adjust height according to content */
  }

  @media ${media.tablet} {
    width: 100%;
    height: auto;
    padding: 15px;
  }

  @media ${media.mobile} {
    width: 100%;
    height: auto;
    padding: 10px;
  }
`;
