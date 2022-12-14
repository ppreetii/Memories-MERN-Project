import React,{useState} from 'react';
import {Avatar,Button,Paper,Container,Grid,Typography} from '@material-ui/core';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import {GoogleLogin} from 'react-google-login';
import Icon from './icon';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {signup,signin} from '../../actions/auth';

const initialState = {firstName:'',lastName:'',email:'',password:'',confirmPassword:''};

const Auth = () => {
    const classes = useStyles();
    const [showPassword,setShowPassword] = useState(false);
    const [formData,setFormData] = useState(initialState);
    const [isSignUp, setisSignUp] = useState(false);
    const dispatch=useDispatch();
    const history =useHistory();
  
    const handleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit =(e)=>{
        e.preventDefault();
        if(isSignUp){
            dispatch(signup(formData,history));
            
        }else{
            
            dispatch(signin(formData,history));
        }

        console.log(formData);
    };

    const handleChange = (e)=>{

        setFormData({...formData,[e.target.name]:e.target.value});

    };
    const googleSucess = async (res)=>{
        // console.log(res);

        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({type:'AUTH' ,data:{result,token}});
            history.push('/');
            
        } catch (error) {
            console.log(error);
        }
    };
    const googleFailure = (error)=>{
        
        console.log("Google Log In Failed. Try again later");
        console.log(error);
    };
    const switchMode = ()=>{
        setFormData(initialState);
        setisSignUp((prevIsSignUp)=>!prevIsSignUp);
        setShowPassword(false);

    };

    return (
        <Container component="main" maxWidth="xs"  >
            <Paper className={classes.paper} elevation={3}  >
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography variant="h5">{isSignUp? "Sign Up" : "Sign In"}</Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Grid container spacing={2} >
                    {
                        isSignUp && (
                            <>
                            <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half/>
                            <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )
                    }

                    <Input name="email" label="Email Address" type="email" handleChange={handleChange} />
                    <Input name="password" label="Password" type={showPassword ? "text" : "password"} handleChange={handleChange} handleShowPassword={handleShowPassword} />
                    {isSignUp && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" className={classes.submit} color="primary" >
                        {isSignUp ? 'Sign Up' : 'Sign In'}

                    </Button>
                    <GoogleLogin
                    clientId="556873350930-98veh1ii1332fk1css4okckernii992j.apps.googleusercontent.com"
                    render={
                        (renderProps) =>(
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon/>} 
                            variant="contained" >
                                Google Sign In

                            </Button>
                        )
                    }

                    onSuccess ={googleSucess}
                    onFailure ={googleFailure}
                    cookiePolicy="single_host_origin"
                    />
                    <Grid container justify="flex-end" >
                        <Button onClick={switchMode}>
{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </Button>
                        
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth
