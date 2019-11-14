import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import MovieCard from "./MovieCard";
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

  saveMovie = () => {
    const addToSavedList = this.props.addToSavedList;
    addToSavedList(this.state.movie);
  };

  deleteMovie = () => {
    axios
    .delete(`http://localhost:5000/api/movies/${this.state.movie.id}`)
    .then(response => {
      console.log("response after delete", response);
      this.props.history.push("/");
    })
    .then(error => {
      console.log("error", error);
    })
  }

  render() {
    if (!this.state.movie) {
      return <div>Loading movie information...</div>;
    }

    return (
      <div className="save-wrapper">
        <MovieCard movie={this.state.movie} />
        <div className="update-button">
          <Link to={`/update-movie/${this.state.movie.id}`}>Update</Link>
        </div>
        <div className="save-button" onClick={this.saveMovie}>
           
          Save
        </div><div className="delete-button" onClick={this.deleteMovie}>Delete</div>
      </div>
    );
  }
}
