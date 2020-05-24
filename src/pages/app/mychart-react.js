import React, {Component} from 'react'
import { Chart } from 'react-charts'

const MyChart=()=>{
    const data = React.useMemo(
      () => [
        {
          label: 'Series 1',
          data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
        },
        {
          label: 'Series 2',
          data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
        },
        {
          label: 'Series 3',
          data: [{ x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }]
        }
      ],
      []
    )
   
    const axes = React.useMemo(
      () => [
        { primary: true, type: 'linear', position: 'bottom' },
        { type: 'linear', position: 'left' }
      ],
      []
    )
   
    return (
      <div
        style={{
          width: '400px',
          height: '300px',
          //background: '#1a1a22',
        }}
      >
        <Chart data={data} axes={axes} />
      </div>
    )
  }


export default MyChart;