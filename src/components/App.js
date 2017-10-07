import React from "react";
import { connect } from "react-redux";


import Graph from "./Graph";
import Form from "./Form";

import { form } from "../reducers";

const App = () => {
    return(

        <main className="container">
            <Form />
            <Graph className="well" width={window.innerWidth} height={window.innerHeight} />
        </main>
    )
}

export default connect()(App);