import logo from './logo.svg';
import './App.css';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import { Redirect } from "react-router-dom";
import { Link} from "react-router-dom";


function Edit(props) {

  const [car, setCar] = useState({brand: '', model: '', color: '', fuel: '', price: 0, year: 0});
 

    React.useEffect(() => {
      fetch('http://carrestapi.herokuapp.com/cars/' + props.location.carId)
      .then(response => response.json()) 
      .then(responseData => { 
        console.log(responseData)
        setCar(responseData)
      })
      .catch(err => console.error(err))
    }, [])
  

    const inputChanged = (event) =>{
     setCar({...car, [event.target.name]: event.target.value});
    }

    const editCar = (event) =>{
      event.preventDefault();
      
      console.log(JSON.stringify({ brand: car.brand }))
  
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          brand: car.brand,
          model: car.model,
          color: car.color,
          fuel: car.fuel,
          price: car.price,
          year: car.year
       
         })
    };
    fetch('http://carrestapi.herokuapp.com/cars/' + props.location.carId, requestOptions)
        .then(response => response.json())
        .then((data => console.log(data)));

        alert("Car edited")
        props.history.push('/')
    }
  
    return(
  <div>
    <h1>Edit car</h1>
  
    <h2><Link to="/">Go back  </Link></h2>
    <div className="editCar">
       
      <TextField name="brand" label="Brand" onChange={inputChanged} value={car.brand} /><br /><br />
      <TextField name="model" label="Model" onChange={inputChanged} value={car.model} />
      <TextField name="color" label="Color" onChange={inputChanged} value={car.color} />
      <TextField name="fuel" label="Fuel" onChange={inputChanged} value={car.fuel} />
      <TextField name="price" label="Price" onChange={inputChanged} value={car.price} />
      <TextField name="year" label="Year" onChange={inputChanged} value={car.year} />
      <Button onClick={editCar}  variant="contained" color="primary">Edit</Button>
      <hr></hr>
      </div>

    </div>
  
    )}


export default Edit;
