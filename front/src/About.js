// import React from 'react';
//  import auth from './auth';

// export const About = props =>  {

//     return (
//         <div>
//             <h1>About</h1>
//             <button 
//                 onClick = {() => {
//                     auth.logout(() => {
//                             props.history.push('/');
//                         });
//                 }}
//             >
//                 Logout
//             </button>
//             </div>
//         );
// }


import React from 'react';
import auth from './auth';

export const About = props =>  {
   
        return (
            <div>
               <h1>About</h1> 

                <button 
                    onClick = {() => {
                        auth.logout(() => { 
                                props.history.push('/');
                            });
                    }} 
                    >
                    logout</button>
            </div>
        );

}