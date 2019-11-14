import React from "react";
import axios from "axios";

export default class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: null
    };
  }

  componentDidMount() {
    this.fetchMovie(this.props.match.params.id);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.match.params.id !== newProps.match.params.id) {
      this.fetchMovie(newProps.match.params.id);
    }
  }

  fetchMovie = id => {
    axios
      .get(`http://localhost:5000/api/movies/${id}`)
      .then(res => this.setState({ movie: res.data }))
      .catch(err => console.log(err.response));
  };

  handleChange = e => {
    console.log(e.target.placeholder === "Actor");

    e.persist();

    if (e.target.placeholder === "Actor") {
      const changeStars = state => {
        const newStars = [...state];
        console.log(newStars);
        newStars[e.target.name] = e.target.value;
        return newStars;
      };

      this.setState({
        movie: {
          ...this.state.movie,
          stars: changeStars(this.state.movie.stars)
        }
      });
    } else {
      console.log("not editing stars");
      this.setState({
        movie: { ...this.state.movie, [e.target.name]: e.target.value }
      });
    }
  };

  submitForm = e => {
    e.preventDefault();
    console.log("Submitted", this.state.movie);

    axios
      .put(
        `http://localhost:5000/api/movies/${this.state.movie.id}`,
        this.state.movie
      )
      .then(response => {
        console.log("response after put", response);

        this.props.history.push("/");
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  render() {
    if (this.state.movie) {
      console.log(this.state.movie);
      return (
        <>
          <div className="save-wrapper">
            <div className="movie-card">
              <form onSubmit={this.submitForm}>
                <input
                  name="title"
                  id="title"
                  type="text"
                  placeholder="Title"
                  value={this.state.movie.title}
                  onChange={this.handleChange}
                />
                <input
                  name="director"
                  id="director"
                  type="text"
                  placeholder="Director"
                  value={this.state.movie.director}
                  onChange={this.handleChange}
                />
                <input
                  name="metascore"
                  id="metascore"
                  type="text"
                  placeholder="Metascore"
                  value={this.state.movie.metascore}
                  onChange={this.handleChange}
                />
                {this.state.movie.stars.map((element, index) => (
                  <input
                    name={`${index}`}
                    id={`${index}`}
                    type="text"
                    placeholder="Actor"
                    value={this.state.movie.stars[index]}
                    onChange={this.handleChange}
                  />
                  // console.log(this.state.movie.stars[index])
                ))}

                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </>
      );
    } else {
      return <p>Loading...</p>;
    }
  }
}
