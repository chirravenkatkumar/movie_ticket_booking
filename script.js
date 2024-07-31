// Sample data for movies, theaters, and seats
const movies = [
    {
      id: 1,
      title: "Comedy Movie 1",
      genre: "Comedy",
      trailer: "https://www.youtube.com/embed/sample1",
      cast: [
        { name: "Actor 1", image: "actor1.jpg" },
        { name: "Actor 2", image: "actor2.jpg" },
      ],
    },
    {
      id: 2,
      title: "Fantasy Movie 1",
      genre: "Fantasy",
      trailer: "https://www.youtube.com/embed/sample2",
      cast: [
        { name: "Actor 3", image: "actor3.jpg" },
        { name: "Actor 4", image: "actor4.jpg" },
      ],
    },
    // Add more movies as needed
  ];
  
  const theaters = [
    { id: 1, name: "Theater 1", timings: ["3:00 PM", "5:00 PM"] },
    { id: 2, name: "Theater 2", timings: ["2:00 PM", "6:00 PM"] },
    // Add more theaters as needed
  ];
  
  let selectedSeats = [];
  
  // Load movies dynamically based on the genre
  function loadMovies() {
    const comedySection = document.getElementById("comedy");
    const fantasySection = document.getElementById("fantasy");
    // ... add more sections as needed
  
    movies.forEach((movie) => {
      const movieElement = document.createElement("a");
      movieElement.href = `movie-details.html?id=${movie.id}`;
      movieElement.innerHTML = `<img src="${movie.image}" alt="${movie.title}">
                                <p>${movie.title}</p>`;
  
      switch (movie.genre) {
        case "Comedy":
          comedySection.querySelector(".movie-list").appendChild(movieElement);
          break;
        case "Fantasy":
          fantasySection.querySelector(".movie-list").appendChild(movieElement);
          break;
        // Add more genres as needed
      }
    });
  }
  
  // Filter movies based on search input
  function filterMovies() {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const movieLinks = document.querySelectorAll(".movie-list a");
  
    movieLinks.forEach((link) => {
      const title = link.querySelector("p").textContent.toLowerCase();
      link.style.display = title.includes(searchInput) ? "block" : "none";
    });
  }
  
  // Load movie details dynamically
  function loadMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get("id"), 10);
    const movie = movies.find((m) => m.id === movieId);
  
    if (movie) {
      document.querySelector(".trailer iframe").src = movie.trailer;
      document.querySelector("main h1").textContent = movie.title;
      const castList = document.querySelector(".cast-list");
      movie.cast.forEach((member) => {
        const castElement = document.createElement("div");
        castElement.className = "cast-member";
        castElement.innerHTML = `<img src="${member.image}" alt="${member.name}">
                                 <p>${member.name}</p>`;
        castList.appendChild(castElement);
      });
    }
  }
  
  // Load theater options dynamically
  function loadTheaters() {
    const theaterList = document.querySelector(".theater-list");
    theaters.forEach((theater) => {
      theater.timings.forEach((time) => {
        const theaterElement = document.createElement("a");
        theaterElement.href = `seat-selection.html?theaterId=${theater.id}&time=${encodeURIComponent(time)}`;
        theaterElement.textContent = `${theater.name} - ${time}`;
        theaterList.appendChild(theaterElement);
      });
    });
  }
  
  // Load seats dynamically and manage seat selection
  function loadSeats() {
    const urlParams = new URLSearchParams(window.location.search);
    const theaterId = parseInt(urlParams.get("theaterId"), 10);
    const time = decodeURIComponent(urlParams.get("time"));
    const seatingChart = document.querySelector(".seating-chart");
  
    // Example of loading a predefined set of seats
    const seats = Array(30).fill("available"); // Simplified example
  
    seats.forEach((status, index) => {
      const seatElement = document.createElement("div");
      seatElement.className = `seat ${status}`;
      seatElement.dataset.seat = `Seat ${index + 1}`;
      seatElement.onclick = () => toggleSeatSelection(seatElement);
      seatingChart.appendChild(seatElement);
    });
  
    // Display selected theater and time
    document.querySelector("main h2").textContent = `${theaters.find(t => t.id === theaterId).name} - ${time}`;
  }
  
  function toggleSeatSelection(seat) {
    if (seat.classList.contains("available")) {
      seat.classList.toggle("selected");
      const seatNumber = seat.dataset.seat;
      if (seat.classList.contains("selected")) {
        selectedSeats.push(seatNumber);
      } else {
        selectedSeats = selectedSeats.filter(s => s !== seatNumber);
      }
    }
  }
  
  // Confirm booking and navigate to confirmation page
  function confirmBooking() {
    if (selectedSeats.length > 0) {
      // Store selected seats in sessionStorage (or any other state management)
      const urlParams = new URLSearchParams(window.location.search);
      const movieId = parseInt(urlParams.get("movieId"), 10);
      const theaterId = parseInt(urlParams.get("theaterId"), 10);
      const time = decodeURIComponent(urlParams.get("time"));
  
      const bookingDetails = {
        movie: movies.find(m => m.id === movieId),
        theater: theaters.find(t => t.id === theaterId),
        time: time,
        seats: selectedSeats
      };
  
      sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
  
      // Redirect to confirmation page
      window.location.href = 'confirmation.html';
    } else {
      alert('Please select at least one seat.');
    }
  }
  
  // Load confirmation details
  function loadConfirmationDetails() {
    const bookingDetails = JSON.parse(sessionStorage.getItem("bookingDetails"));
  
    if (bookingDetails) {
      const { movie, theater, time, seats } = bookingDetails;
      const confirmationDetails = document.querySelector(".ticket-details");
  
      confirmationDetails.innerHTML = `<p>Movie: ${movie.title}</p>
                                       <p>Theater: ${theater.name}</p>
                                       <p>Time: ${time}</p>
                                       <p>Seats: ${seats.join(', ')}</p>`;
    }
  }
  
  // Event listeners
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("search")) {
      document.getElementById("search").addEventListener("input", filterMovies);
    }
  
    if (document.body.id === "index") {
      loadMovies();
    } else if (document.body.id === "movie-details") {
      loadMovieDetails();
    } else if (document.body.id === "theater-selection") {
      loadTheaters();
    } else if (document.body.id === "seat-selection") {
      loadSeats();
    } else if (document.body.id === "confirmation") {
      loadConfirmationDetails();
    }
  });
  