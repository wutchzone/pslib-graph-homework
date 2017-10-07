import React, { Component } from "react";
import { connect } from "react-redux";

import { form } from "../reducers";



class Graph extends Component {
    constructor(props) {
        super(props);

        this.state = { canvas: undefined };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.Draw = this.Draw.bind(this);
        this.MaxY = this.MaxY.bind(this);
        this.MinY = this.MinY.bind(this);
        this.MaxX = this.MaxX.bind(this);
        this.MinX = this.MinX.bind(this);
        this.XC = this.XC.bind(this);
        this.YC = this.YC.bind(this);
        this.DrawAxes = this.DrawAxes.bind(this);
        this.RenderFunction = this.RenderFunction.bind(this);
    }
    render() {
        return (
            <canvas ref="canvas" width={this.props.width} height={this.props.height}>
                CANVAS NOT SUPPORTED IN THIS BROWSER!
            </canvas>
        )
    }
    componentDidMount() {
        this.Draw((a) => Math.sin(a));
    }
    componentDidUpdate() {
        if (this.props.formData.values == null || this.props.formData.syncErrors != null) {
            console.log("ukonci to");
            return;
        };
        const { Frequency, Amplitude, PhaseShift } = this.props.formData.values;
        this.Draw((a) => Amplitude * Math.sin(Frequency * a - (PhaseShift * Math.PI / 180)));
    }

    Draw(func) {
        var Canvas = this.refs.canvas;
        if (Canvas.getContext) {
            var Ctx = Canvas.getContext('2d');
            const { width, height } = Canvas;
            Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
            this.DrawAxes(Ctx, width, height);
            this.RenderFunction(Ctx, func, width, height);
        } else {
            // Canvas not supported code goes here.
        }
    }

    // Returns the right boundary of the logical viewport:
    MaxX() {
        return 10 * this.props.formData.values.Scale;
    }

    // Returns the left boundary of the logical viewport:
    MinX() {
        return -10 * this.props.formData.values.Scale;
    }

    // Returns the top boundary of the logical viewport:
    MaxY(x, y) {
        return this.MaxX() * y / x;
    }

    // Returns the bottom boundary of the logical viewport:
    MinY(x, y) {
        return this.MinX() * y / x;
    }

    // Returns the physical x-coordinate of a logical x-coordinate:
    XC(x, canvasWidth) {
        return (x - this.MinX()) / (this.MaxX() - this.MinX()) * canvasWidth;
    }

    // Returns the physical y-coordinate of a logical y-coordinate:
    YC(y, canvasWidth, canvasHeight) {
        return canvasHeight - (y - this.MinY(canvasWidth, canvasHeight)) / (this.MaxY(canvasWidth, canvasHeight) - this.MinY(canvasWidth, canvasHeight)) * canvasHeight;
    }

    // Returns the distance between ticks on the X axis:
    XTickDelta() {
        return Math.PI;
    }

    // Returns the distance between ticks on the Y axis:
    YTickDelta() {
        return 1;
    }

    // DrawAxes draws the X ad Y axes, with tick marks.
    DrawAxes(Ctx, x, y) {
        Ctx.save();
        Ctx.lineWidth = 2;
        // +Y axis
        Ctx.beginPath();
        Ctx.moveTo(this.XC(0, x), this.YC(0, x, y));
        Ctx.lineTo(this.XC(0, x), this.YC(this.MaxY(x, y), x, y));
        Ctx.stroke();

        // -Y axis
        Ctx.beginPath();
        Ctx.moveTo(this.XC(0, x), this.YC(0, x, y));
        Ctx.lineTo(this.XC(0, x), this.YC(this.MinY(x, y), x, y));
        Ctx.stroke();

        // Y axis tick marks
        var delta = this.YTickDelta();
        for (var i = 1; (i * delta) < this.MaxY(x, y); ++i) {
            Ctx.beginPath();
            Ctx.moveTo(this.XC(0, x) - 5, this.YC(i * delta, x, y));
            Ctx.lineTo(this.XC(0, x) + 5, this.YC(i * delta, x, y));
            Ctx.stroke();
        }

        var delta = this.YTickDelta();
        for (var i = 1; (i * delta) > this.MinY(x, y); --i) {
            Ctx.beginPath();
            Ctx.moveTo(this.XC(0, x) - 5, this.YC(i * delta, x, y));
            Ctx.lineTo(this.XC(0, x) + 5, this.YC(i * delta, x, y));
            Ctx.stroke();
        }
        // +X axis
        Ctx.beginPath();
        Ctx.moveTo(this.XC(0, x), this.YC(0, x, y));
        Ctx.lineTo(this.XC(this.MaxX(), x), this.YC(0, x, y));
        Ctx.stroke();

        // -X axis
        Ctx.beginPath();
        Ctx.moveTo(this.XC(0, x), this.YC(0, x, y));
        Ctx.lineTo(this.XC(this.MinX(), x), this.YC(0, x, y));
        Ctx.stroke();

        // X tick marks
        var delta = this.XTickDelta();
        for (var i = 1; (i * delta) < this.MaxX(); ++i) {
            Ctx.beginPath();
            Ctx.moveTo(this.XC(i * delta, x), this.YC(0, x, y) - 5);
            Ctx.lineTo(this.XC(i * delta, x), this.YC(0, x, y) + 5);
            Ctx.stroke();
        }

        var delta = this.XTickDelta();
        for (var i = 1; (i * delta) > this.MinX(); --i) {
            Ctx.beginPath();
            Ctx.moveTo(this.XC(i * delta, x), this.YC(0, x, y) - 5);
            Ctx.lineTo(this.XC(i * delta, x), this.YC(0, x, y) + 5);
            Ctx.stroke();
        }
        Ctx.restore();
    }
    // RenderFunction(f) renders the input funtion f on the canvas.
    RenderFunction(Ctx, f, canvasWidth, canvasHeight) {
        var XSTEP = (this.MaxX() - this.MinX()) / canvasWidth;
        var first = true;

        Ctx.beginPath();
        for (var x = this.MinX(); x <= this.MaxX(); x += XSTEP) {

            var y = f(x); //rendered function
            if (first) {
                Ctx.moveTo(this.XC(x, canvasWidth), this.YC(y, canvasWidth, canvasHeight));
                first = false;
            } else {
                Ctx.lineTo(this.XC(x, canvasWidth), this.YC(y, canvasWidth, canvasHeight));
            }
        }
        Ctx.stroke();
    }
}


function mapAppSateToLocalProps(props) {
    return {
        formData: props.form.simple
    }
}

export default connect(mapAppSateToLocalProps)(Graph);
