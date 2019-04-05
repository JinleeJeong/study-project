import {Route, Redirect} from 'react-router-dom';
import React from 'react';

function PrivateRoute ({component: Component, ...rest}){
	return (
		<Route
			{...rest}
			render = {(props) => JSON.parse(localStorage.getItem("loginState")) === true 
			? <Component {...props} />
			: <Redirect to = {{pathname: '/', state: {from : props.location}}}/>
			}
		/>
	)
}

export default PrivateRoute