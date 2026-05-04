import { Component } from 'react';
import Header from './components/Header';
import Main from './components/Main';

class App extends Component<object, { lastSearch: string }> {
  constructor(props: object) {
    super(props);
    const saved = localStorage.getItem("searchTerm") || "";
    this.state = { lastSearch: saved};
  }

  handleSearch = (searchTerm: string) => {
    const cleanTerm = searchTerm.trim();

    if (cleanTerm === this.state.lastSearch) return;

    this.setState({ lastSearch: cleanTerm });
  };

  render() {
    return (
      <>
        <Header onSubmitted={this.handleSearch} />
        <Main searchTerm={this.state.lastSearch} />
      </>
    );
  }
}

export default App;
