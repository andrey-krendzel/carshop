import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import Component from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import EditCellRenderer from './EditCellRenderer.jsx';
import DeleteCellRenderer from './DeleteCellRenderer.jsx';
import { useRef } from 'react';
import {Link} from "react-router-dom";


function App() {
  const [cars, setCars] =  useState([]);
  const [links, setLinks] = useState();
  const [newCar, setNewCar] = useState({brand: '', model: '', color: '', fuel: '', price: 0, year: 0});
  
  

  React.useEffect(() => {
    fetch('http://carrestapi.herokuapp.com/cars')
    .then(response => response.json()) 
    .then(responseData => { 
      console.log(responseData._embedded.cars)
      setCars(responseData._embedded.cars)
      setLinks(responseData._links)
      
      console.log(responseData._links)
    })
    .catch(err => console.error(err))
  }, [])

  const handleClick = (serverId, actualIndex) =>{

    // Server-side delete
    const requestOptions = {
      method: 'DELETE'
    };
  
    fetch("http://carrestapi.herokuapp.com/cars/" + (serverId), requestOptions)
    
    // Client-side delete: 
    // Notice that SERVER ID of the car != Index of the car in the CLIENT LIST, hence the need for id, and actualIndex
    const newCarList = cars.filter((item, index) => index !== actualIndex)
    setCars(newCarList)
  }

  const inputChanged = (event) =>{
    setNewCar({...newCar, [event.target.name]: event.target.value});
  }

  const addCar = (event) =>{
    event.preventDefault();
    // setCars([...cars, newCar]);
    console.log(JSON.stringify({ brand: newCar.brand }))

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        brand: newCar.brand,
        model: newCar.model,
        color: newCar.color,
        fuel: newCar.fuel,
        price: newCar.price,
        year: newCar.year
     
       })
  };
  fetch('http://carrestapi.herokuapp.com/cars/', requestOptions)
      .then(response => response.json())
      .then((data => console.log(data)));
  }



  
  return (
    <div>
      <h1>Car Shop</h1>
      <hr></hr>
      <div className="addCar">
        <h1> Add new car </h1>
      <TextField name="brand" label="Brand" onChange={inputChanged} value={newCar.brand}/>
      <TextField name="model" label="Model" onChange={inputChanged} value={newCar.model}/>
      <TextField name="color" label="Color" onChange={inputChanged} value={newCar.color}/>
      <TextField name="fuel" label="Fuel" onChange={inputChanged} value={newCar.fuel}/>
      <TextField name="price" label="Price" onChange={inputChanged} value={newCar.price}/>
      <TextField name="year" label="Year" onChange={inputChanged} value={newCar.year}/>
      <Button onClick={addCar} variant="contained" color="primary">Add</Button>
      <hr></hr>
      </div>
   
      <table>
          <thead>
              <tr>
                <th>Car id (on the server)</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Color</th>
                  <th>Fuel</th>
                  <th>Price</th>
                  <th>Year</th>
                  <th></th>
                  <th></th>
              </tr>
              </thead>
          {cars.map((car, index) =>  
        <tbody>
        <tr key={index}>
          <td>{car._links.self.href.split("/").[4]}</td>
          <td>{car.brand}</td>
          <td>{car.model}</td>
          <td>{car.color}</td>
          <td>{car.fuel}</td>
          <td>{car.price}</td>
          <td>{car.year}</td>
          <td><button onClick={() => handleClick(car._links.self.href.split("/").[4], index)}>Delete</button></td>
          <td><button><Link to={{
            pathname: '/edit/' + car._links.self.href.split("/").[4],
            carId: car._links.self.href.split("/").[4]
            }}>Edit</Link>{' '}</button></td>
          </tr>
          </tbody>)}
          </table> 
          </div> 
  );
}

export default App;
