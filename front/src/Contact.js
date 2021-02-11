import React, { Component } from 'react';


class Contact extends Component {
    
    constructor(props){
        super(props);
        this.state = { apiResponse : "" };
    }

    callAPI () {
        fetch("http://localhost:5000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({apiResponse : res}))
        .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render () {
        return (
            <div>
                <h1>CONTACT</h1>
                <p>{this.state.apiResponse}</p>
            </div>
        )
    }
}

export default Contact;