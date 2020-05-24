import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2'

export default class Chart extends Component {

    constructor(props){
        super(props)
        console.log(this.props.type)
        this.state={
            chartData:{
                labels: this.props.labels,
                datasets: [{
                    label: this.props.title,
                    data: this.props.data,
                    backgroundColor: '#eb425664',
                    borderColor: '#eb4255',
                    borderWidth: 1
                }]
                
            }
        }

    }
    load(){
        const defaultOptions={
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
        }
        switch(this.props.type){
            case "bar":
                return <Bar data={this.state.chartData} options={defaultOptions}/>
            case "pie":
                return <Pie data={this.state.chartData} options={defaultOptions}/>
            default:
                return <Bar data={this.state.chartData} options={defaultOptions}/>
        }
    }

    render(){
        //const {graphic} = this.state

        return(
            <div className="chart">
                {this.load()}
                
            </div>
        )
    }
}

