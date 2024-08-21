// Scroll smoothly between headers
document.querySelectorAll(".storyHeader a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Read paragraph from json file and load to html file
async function getDescription(firstKey, secondKey) {
  try {
    const response = await fetch("./data/json/storyContents.json");
    const data = await response.json();

    if (data[firstKey] && data[firstKey][secondKey]) {
      return data[firstKey][secondKey];
    } else {
      throw new Error("Invalid keys provided.");
    }
  } catch (error) {
    console.error("Error fetching or processing JSON:", error);
    return "Error: Unable to retrieve the description.";
  }
}

async function displayDescription(firstKey, secondKey, elementId) {
  const description = await getDescription(firstKey, secondKey);
  document.getElementById(elementId).innerText = description;
}

document.addEventListener("DOMContentLoaded", () => {
  // Select all <p> elements with IDs that start with "description" or "shortinfo"
  const paragraphs = document.querySelectorAll('p[id^="description"]');

  paragraphs.forEach((paragraph) => {
    const firstKey = paragraph.getAttribute("data-first-key");
    const secondKey = paragraph.getAttribute("data-second-key");
    displayDescription(firstKey, secondKey, paragraph.id);
  });
});

// Scroll to Top Function
function scrollToTop() {
  document.querySelector('.storyContentContainer').scrollTo({
      top: 0,
      behavior: 'smooth'
  });
}



// Print current active header
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.storyContentContainer');
  const headers = container.querySelectorAll('h1');
  const activeHeaderIndexDisplay = document.getElementById('activeHeaderIndexDisplay');
  let lastActiveHeaderIndex = null;

  const checkHeaderPositions = () => {
      let currentActiveHeaderIndex = null;

      headers.forEach((header, index) => {
          const headerRect = header.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Calculate the top position of the header relative to the container
          const headerTopRelativeToContainer = headerRect.top - containerRect.top;

          // Check if the header is within the top 35% of the container
          if (headerTopRelativeToContainer >= container.clientHeight*(-0.3) && headerTopRelativeToContainer <= container.clientHeight * 0.5) {
              currentActiveHeaderIndex = index;
          }
      });

      if (currentActiveHeaderIndex !== null && currentActiveHeaderIndex !== lastActiveHeaderIndex) {
          // Print to console
          console.log(`view${currentActiveHeaderIndex}`);

          // Update the HTML display element if it exists
          if (activeHeaderIndexDisplay) {
              activeHeaderIndexDisplay.textContent = `view${currentActiveHeaderIndex + 1}`;
          }

          // Remove active class from all headers
          headers.forEach(h => h.classList.remove('activeHeader'));
          // Add active class to the current active header
          headers[currentActiveHeaderIndex].classList.add('activeHeader');

          // Call setCameraView with the current active view
          setCameraView(`view${currentActiveHeaderIndex + 1}`);
          toggleEntities(`showBuild${currentActiveHeaderIndex+1}`);

          lastActiveHeaderIndex = currentActiveHeaderIndex;
      }
  };

  // Check header positions on initial load
  checkHeaderPositions();
  // Check header positions on scroll
  container.addEventListener('scroll', checkHeaderPositions);
});

// Define setCameraView function
function setCameraView(view) {
  console.log(`Setting camera view to: ${view}`);
  // Add your Cesium camera view setting code here
}
// Define setCameraView function
function toggleEntities(view) {
  console.log(`Entities toggled to: ${view}`);
  // Add your Cesium camera view setting code here
}

