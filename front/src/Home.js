import React from 'react';
import auth from './auth';

export const Home = props =>  {
   
        return (
            <div>
               <h1>HOME</h1> 

                <button 
                    onClick = {() => {
                        auth.login(() => { 
                                props.history.push('/about');
                            });
                    }} 
                    >
                        LOGIN</button>
            </div>
        );

}

