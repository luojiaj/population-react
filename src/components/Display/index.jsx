import React, { Component } from 'react'
import './index.css'
import Highcharts from 'highcharts'
export default class index extends Component {
  state={
    city:[],
    number:[]
  }
  async componentDidMount(){
    //都道府県
    const Tores = await fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures",{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        'X-API-KEY':'fJIvBBcHj8cjwd4KdSRVsCSlHzz1z8jbap7HF52R'
      },
    })
    const Tdata = await Tores.json();
    this.setState({
      city: Tdata.result,
    })
    //データinit
    const peopleNumber = await fetch(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=13`,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        'X-API-KEY':'fJIvBBcHj8cjwd4KdSRVsCSlHzz1z8jbap7HF52R'
      }
    })
    const people = await peopleNumber.json();
    const totalPeopleNumber = people.result.data[0].data;
    const tempArr = []; 
    totalPeopleNumber.forEach((item,index) => {
        tempArr.push(item.value);
    });
    var numb = this.state.number;
    numb.push({
      name: "東京都",
      data:tempArr
    })
    this.setState({
      number: numb
    })
  }


  handleNumber=(prefName, prefCode)=>{
    return async (e)=>{
      if(e.target.checked){
        const peopleNumber = await fetch(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`,{
          method:'GET',
          headers:{
            'Content-Type': 'application/json',
            'X-API-KEY':'fJIvBBcHj8cjwd4KdSRVsCSlHzz1z8jbap7HF52R'
          }
        })
        const people = await peopleNumber.json();
        const totalPeople = people.result.data[0].data;
        const tempArr = [];
        totalPeople.forEach((item,index) => {
            tempArr.push(item.value);
        });
        let numb = this.state.number;
        numb.push({
          name: prefName,
          data:tempArr
        })
        this.setState({
          number: numb
        })
      } else {
        //データdelete
        let numb = this.state.number;
        numb.map((item, index)=>{
          if(item.name === prefName){
            numb.splice(index, 1);
          }
          return item.id
        })
        this.setState({
          number:numb
        })
      }
    }
  }
  componentDidUpdate(){
    Highcharts.chart('graph', {
      title: {
        text: '都道府県総人数',
      },
      xAxis:{
        title:{
          text:'年度'
        },
      },
      accessibility: {
        enabled: false
      },
      yAxis: {
        title: {
          text: '総人数'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        series: {
          animation:true,
          label: {
            connectorAllowed: false
          },
          pointStart: 1960,
          pointInterval: 5
        }
      },
      series: this.state.number,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    });
  }
  render() {
    
    return (
    <div className='container'>
      <div className='head'>都道府県</div>
      <div className='singleBox'>
        {this.state.city.map((item, index)=>
        {
          return(
            <label className='label_item' key={index}>
              <span className='wrap_item'>
                <input className="wrap_input" defaultChecked={item.prefCode === 13? true:false} type="checkbox" onChange={this.handleNumber(item.prefName,item.prefCode)}/>{item.prefName}
              </span>
            </label>
          )
        })
        }
      </div>
      <div id="graph"></div>
    </div>
    )
  }
}
