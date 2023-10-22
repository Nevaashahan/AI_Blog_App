import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [guess, setGuess] = useState("");
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/post")
      .then((response) => {
        response.json().then((data) => {
          setPosts(data);
        });
      });
  }, []);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1; // Generates a random number between 1 and 10
  }

  function handleGuess(e) {
    e.preventDefault();
    const userGuess = parseInt(guess, 10);

    if (isNaN(userGuess)) {
      setMessage("Please enter a valid number.");
    } else {
      if (userGuess < randomNumber) {
        setMessage("Try a higher number.");
      } else if (userGuess > randomNumber) {
        setMessage("Try a lower number.");
      } else {
        setMessage(`Congratulations! You guessed the number ${randomNumber}.`);
        setRandomNumber(generateRandomNumber());
      }
    }
  }

  // Function to filter posts by title
  function filterPostsByTitle() {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const filteredPosts = filterPostsByTitle();

  function handleHelpFormSubmit(e) {
    e.preventDefault();
    // Here, you can send the email and complaint summary to your email address using an API or a backend service.
    // For the sake of this example, we'll just log the details to the console.
    console.log("Email: ", email);
    console.log("Complaint Summary: ", complaint);
    setHelpModalOpen(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <div>
        <h2>Search Posts by Title</h2>
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post, index) => (
          <Post key={index} {...post} />
        ))
      ) : (
        <p>No posts found for the given title.</p>
      )}

      <div>
        <h2>Number Guessing Game</h2>
        <p>Guess a number between 1 and 10:</p>
        <form onSubmit={handleGuess}>
          <input
            type="number"
            min="1"
            max="10"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button type="submit">Submit Guess</button>
        </form>
        <p>{message}</p>
      </div>

      <button
        onClick={() => setHelpModalOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "100px", // Set the width
        }}
      >
        Help Us
      </button>

      {isHelpModalOpen && (
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#fff", padding: "20px", borderRadius: "5px" }}>
            <h2>Help Us</h2>
            <form onSubmit={handleHelpFormSubmit}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="complaint">Complaint Summary:</label>
              <textarea
                id="complaint"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
            <button onClick={() => setHelpModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}