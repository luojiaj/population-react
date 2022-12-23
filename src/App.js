import React, { Component } from 'react'
import Header from'./components/Header'
import Check from './components/Display'
export default class App extends Component {

  render() {
    return (
      <div>
        <Header/>
        <Check/>
      </div>
    )
  }
}
