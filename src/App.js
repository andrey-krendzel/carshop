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
import { Minimize } from '@material-ui/icons';
import {CSVLink, CSVDownload} from 'react-csv';
import Tabs from '@material-ui/core/Tabs';
import Tab from'@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';


function AddCar(props){

    return(<div className="addCar">
    <h1> Add new car </h1>
  <TextField name="brand" label="Brand" onChange={props.inputChanged} value={props.newCar.brand}/>
  <TextField name="model" label="Model" onChange={props.inputChanged} value={props.newCar.model}/>
  <TextField name="color" label="Color" onChange={props.inputChanged} value={props.newCar.color}/>
  <TextField name="fuel" label="Fuel" onChange={props.inputChanged} value={props.newCar.fuel}/>
  <TextField name="price" label="Price" onChange={props.inputChanged} value={props.newCar.price}/>
  <TextField name="year" label="Year" onChange={props.inputChanged} value={props.newCar.year}/>
  <Button onClick={props.addCar} variant="contained" color="primary">Add</Button>
  <hr></hr>
  </div>)
}

function App(props) {
  const [cars, setCars] =  useState([]);
  const [update, setUpdate] = useState();
  const[tabValue, setTabValue] = useState('one');
  const [links, setLinks] = useState();
  const [newCar, setNewCar] = useState({brand: '', model: '', color: '', fuel: '', price: 0, year: 0});
  const [sortedField, setSortedField] = React.useState();
  const [direction, setDirection ] = React.useState()
  const [filter, setFilter] = React.useState({brand: '', model: '', color:'', fuel: '', price: {min: 0, max: 1000000}, year: ''})
  

  React.useEffect(() => {
    fetch('http://carrestapi.herokuapp.com/cars')
    .then(response => response.json()) 
    .then(responseData => { 
      console.log(responseData._embedded.cars)
      setCars(responseData._embedded.cars)
      
      console.log(cars)
    })
    .catch(err => console.error(err))
  }, [update])

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
      .then((data => console.log(data)))
      
  setUpdate(1)
  }

  //Sort magic
  //Dont execute the function if sortedField isn't modified
  if(sortedField != null){

    if (direction == 'asc'){
      //Asc
    cars.sort((a, b) => {
      if (a[sortedField] < b[sortedField]) {
        return -1;
      }
      if (a[sortedField] > b[sortedField]) {
        return 1;
      }
      return 0;
    });
  } else {
    // Desc
    cars.sort((a, b) => {
      if (a[sortedField] < b[sortedField]) {
        return 1;
      }
      if (a[sortedField] > b[sortedField]) {
        return -1;
      }
      return 0;
    });
  }

  }

  // FILTERRS

  const brandFilterChanged = (event) => {
    setFilter({...filter, brand: event.target.value})
  }

  const modelFilterChanged = (event) => {
    setFilter({...filter, model: event.target.value})
  }
  const colorFilterChanged = (event) => {
    setFilter({...filter, color: event.target.value})
  }

  const fuelFilterChanged = (event) => {
    setFilter({...filter, fuel: event.target.value})
  }

  const minFilterChanged = (event) => {
    setFilter({...filter, 
      price: {
      max: filter.price.max, 
      min: event.target.value
    }
    })
  }

  const maxFilterChanged = (event) => {
    setFilter({...filter, price: {min: filter.price.min, max: event.target.value}})
  }
  
  const yearFilterChanged = (event) => {
    setFilter({...filter, year: event.target.value})
  }

  //Tabs

  const handleTabChange = (event, tabValue) => {
    setTabValue(tabValue);
};

  
  return (
    <div>
      <h1>Car Shop</h1>
      <div>
        <AppBar position="static">
        <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab value="one" label="Add Car"/>
            <Tab value="two" label="My Todos"/>
           
            </Tabs>
            </AppBar>
            {tabValue==='one' && <AddCar inputChanged={inputChanged} addCar={addCar} newCar={newCar} />}
            {tabValue==='two' && <div></div>}
            
            </div>


      <div className="filterCar">
      <h1> Filter car </h1>
      By brand: <input onChange={brandFilterChanged} value={filter.brand}></input> <br />
      By model: <input onChange={modelFilterChanged} value={filter.model}></input> <br />
      By color: <input onChange={colorFilterChanged} value={filter.color}></input> <br />
      By fuel: <input onChange={fuelFilterChanged} value={filter.fuel}></input> <br />
      By price range: Min <input  onChange={minFilterChanged} value={filter.price.min}></input> Max <input onChange={maxFilterChanged} value={filter.price.max}></input>  <br />
      By year: <input onChange={yearFilterChanged} value={filter.year}></input> &nbsp; 
      </div>
      <hr></hr>
      <div className="exportCar">
      <h1> Export  </h1>
      <CSVLink data={cars.filter(car => car.brand.toLowerCase().includes(filter.brand.toLowerCase()))
         .filter(car => car.model.toLowerCase().includes(filter.model.toLowerCase()))
         .filter(car => car.color.toLowerCase().includes(filter.color.toLowerCase()))
         .filter(car => car.fuel.toLowerCase().includes(filter.fuel.toLowerCase()))
         .filter(car => car.price > filter.price.min && car.price < filter.price.max)
          .filter(car => car.year.toString().toLowerCase().includes(filter.year.toString().toLowerCase()))} >Download in .csv</CSVLink>
      </div>
      <hr></hr>
     
  
   
      <table>
          <thead>
              <tr>
                <th>ID  </th>
                  <th>
                    Brand &nbsp;
                    <button type="button" onClick={() => {setSortedField('brand'); setDirection('asc')}}>Asc</button>
                    <button type="button" onClick={() => {setSortedField('brand'); setDirection('desc')}}>Desc</button>
                  </th>

                  <th>
                    Model &nbsp; 
                    <button type="button" onClick={() => {setSortedField('model'); setDirection('asc')}}>Asc</button>
                    <button type="button" onClick={() => {setSortedField('model'); setDirection('desc')}}>Desc</button>
                  </th>

                  <th>
                    Color &nbsp;
                    <button type="button" onClick={() => {setSortedField('color'); setDirection('asc')}}>Asc</button>
                    <button type="button" onClick={() => {setSortedField('color'); setDirection('desc')}}>Desc</button>
                  </th>
                  <th>
                    Fuel &nbsp;
                    <button type="button" onClick={() => {setSortedField('fuel'); setDirection('asc')}}>Asc</button>
                    <button type="button" onClick={() => {setSortedField('fuel'); setDirection('desc')}}>Desc</button>
                  </th>
                  <th>
                    Price &nbsp;
                    <button type="button" onClick={() => {setSortedField('price'); setDirection('asc')}}>Asc</button>
                    <button type="button" onClick={() => {setSortedField('price'); setDirection('desc')}}>Desc</button>
                  </th>
                  <th>
                    Year &nbsp;
                    <button type="button" onClick={() => {setSortedField('year'); setDirection('asc')}}>Asc</button>
                    <button type="button" onClick={() => {setSortedField('year'); setDirection('desc')}}>Desc</button>
                  </th>
                  <th></th>
                  <th></th>
              </tr>
              </thead>
          {cars
          .filter(car => car.brand.toLowerCase().includes(filter.brand.toLowerCase()))
         .filter(car => car.model.toLowerCase().includes(filter.model.toLowerCase()))
         .filter(car => car.color.toLowerCase().includes(filter.color.toLowerCase()))
         .filter(car => car.fuel.toLowerCase().includes(filter.fuel.toLowerCase()))
         .filter(car => car.price > filter.price.min && car.price < filter.price.max)
          .filter(car => car.year.toString().toLowerCase().includes(filter.year.toString().toLowerCase()))
          .map((car, index) =>  
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
