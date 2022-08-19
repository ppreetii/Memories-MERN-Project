import {AUTH,LOGOUT} from '../constants/actionTypes';

const authReducer = (state={authData:null},action) =>{
switch(action.type){
    case AUTH :
        // ?. is called optional chaining. this doesn't throw an error if action value doesn't exist
        // console.log(action?.data);
        localStorage.setItem('profile',JSON.stringify({...action?.data}));
        return {...state, authData : action?.data};

    case LOGOUT:
        localStorage.clear();
        return {...state, authData : null};
        default:
            return state;
}
}
export default authReducer;