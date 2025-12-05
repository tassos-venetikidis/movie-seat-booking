const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
let ticketPrice = +movieSelect.value;
let movieName =
  movieSelect.querySelectorAll("option")[movieSelect.selectedIndex].text;
let movies;
let movie;
if (localStorage.getItem("movies")) {
  movies = JSON.parse(localStorage.getItem("movies"));
  movie = movies.filter((movie) => movie.name === movieName)[0];
} else {
  movie = {
    name: movieName,
    ticketPrice: ticketPrice,
    ticketCount: 0,
    total: 0,
    selected: [],
  };
  movies = [movie];
}

populateUI(movie);

function populateUI(movie) {
  for (const seat of seats) {
    seat.classList.remove("selected");
    let x = seat.dataset.x;
    let y = seat.dataset.y;
    for (const selectedSeat of movie.selected) {
      if (x === selectedSeat[0] && y === selectedSeat[1]) {
        seat.classList.add("selected");
      }
    }
  }
  count.textContent = movie.ticketCount;
  total.textContent = movie.total;
}

container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    if (e.target.classList.contains("selected")) {
      e.target.classList.remove("selected");
      movie.selected.splice(
        movie.selected.findIndex(
          (element) =>
            element[0] === e.target.dataset.x &&
            element[1] === e.target.dataset.y
        ),
        1
      );
      movie.ticketCount--;
    } else {
      e.target.classList.add("selected");
      movie.selected.push([e.target.dataset.x, e.target.dataset.y]);
      movie.ticketCount++;
    }
    movie.total = movie.ticketPrice * movie.ticketCount;
    count.textContent = movie.ticketCount;
    total.textContent = movie.total;
    localStorage.setItem("movies", JSON.stringify(movies));
  }
});

movieSelect.addEventListener("change", (e) => {
  movieName =
    movieSelect.querySelectorAll("option")[movieSelect.selectedIndex].text;
  if (movies.some((movie) => movie.name === movieName)) {
    const indexOfMovie = movies.findIndex((movie) => movie.name === movieName);
    movie = movies[indexOfMovie];
  } else {
    movie = {
      name: movieName,
      ticketPrice: +e.target.value,
      ticketCount: 0,
      total: 0,
      selected: [],
    };
    movies.push(movie);
  }
  populateUI(movie);
});
