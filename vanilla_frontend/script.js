// Store the added tags in an array
const tagsArray = [];

// Function to handle adding tags
function addTag(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the form from submitting

    const tagInput = document.getElementById("tagsInput");
    const tag = tagInput.value.trim();

    if (tag) {
      tagsArray.push(tag);
      tagInput.value = ""; // Clear the input field

      updateTagsContainer(); // Update the UI to display the added tags
    }
  }
}

// Function to update the tags container with the added tags
function updateTagsContainer() {
  const tagsContainer = document.getElementById("tagsContainer");
  tagsContainer.innerHTML = ""; // Clear previous tags

  tagsArray.forEach((tag, index) => {
    const tagElement = document.createElement("span");
    tagElement.textContent = tag;
    tagElement.dataset.index = index; // Set a data attribute with the index

    // Add click event listener to delete the tag
    tagElement.addEventListener("click", (event) => {
      const clickedIndex = event.target.dataset.index;
      tagsArray.splice(clickedIndex, 1); // Remove the tag from the array
      updateTagsContainer(); // Update the UI to reflect the changes
    });

    tagsContainer.appendChild(tagElement);
  });
}
// Attach event listener to the input keydown event
document.getElementById("tagsInput").addEventListener("keydown", addTag);

// Function to handle form submission
function submitForm(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the input values
  const url = document.getElementById("urlInput").value;
  const tags = tagsArray; // Use the updated tags array

  // Create the request payload
  const payload = {
    url,
    tags,
  };

  // Make a POST request to the backend
  fetch("/getLinks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      // Process the response data and update the UI
      console.log(data);
      displayResult(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to display the result on the UI
function displayResult(data) {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = ""; // Clear previous results

  data.forEach((item) => {
    const title = item.title;
    const updatedTags = item.updatedTags;
    const imageLink = item.imageLink;
    const link = item.link; // New property for the link

    // Create a card element
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    // Create a title element
    const titleElement = document.createElement("h3");
    const linkElement = document.createElement("a");
    linkElement.href = link; // Set the link URL
    linkElement.target = "_blank"; // Open the link in a new tab
    linkElement.textContent = title;

    titleElement.appendChild(linkElement);

    // Create a tags element
    const tagsElement = document.createElement("p");
    tagsElement.textContent = "Updated tags: " + updatedTags.join(", ");

    // Create an image element
    const imageElement = document.createElement("p");
    const imageLinkElement = document.createElement("img");
    imageLinkElement.src = imageLink;
    imageElement.appendChild(imageLinkElement);

    // Append elements to the card
    cardElement.appendChild(titleElement);
    cardElement.appendChild(tagsElement);
    cardElement.appendChild(imageElement);

    // Append the card to the result container
    resultContainer.appendChild(cardElement);
  });
}

// Attach event listener to the form submit event
document.getElementById("urlForm").addEventListener("submit", submitForm);
