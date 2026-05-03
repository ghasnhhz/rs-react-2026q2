import { Component, type ChangeEvent } from "react";

interface HeaderProps  {
    onSubmitted: (text: string) => void
}

type HeaderState = {
    input: string
}

class Header extends Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props)
        this.state = {input: ""}
    }

    componentDidMount(): void {
        const saved = localStorage.getItem("searchTerm");

        if (saved) {
            this.setState({ input: saved });
        }
    }


    update = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: e.target.value})
    }

    handleButtonClick = () => {
        localStorage.setItem("searchTerm", this.state.input);
        this.props.onSubmitted(this.state.input);
    }

    render() {
        return (
            <div className="header">
                <input type="text" className="search-input" onChange={this.update} value={this.state.input}/>
                <button className="search-button" onClick={this.handleButtonClick}>Search</button>
            </div>
        )
    }
}

export default Header