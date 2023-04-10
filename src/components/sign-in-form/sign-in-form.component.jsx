import { useState, useContext } from "react";
import {UserContext} from '../contexts/user.context'

import FormInput from "../../components/form-input/form-input.component";
import "./sign-in-form.styles.scss";
import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword
} from "../../utils/firebase/firebase.utils";
import Button from "../button/button.component";


const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {


  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  // console.log(formFields);

  // const val = useContext(UserContext);
   

  const {setCurrentUser} = useContext(UserContext);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup();
    await createUserDocumentFromAuth(user);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const {user} = await signInAuthUserWithEmailAndPassword(email, password);
      resetFormFields();
      setCurrentUser(user);
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          alert("incorrect password for email");
          break;
        case "auth/user-not-found":
          alert('no user associated with this email');
          break;
        default:
          console.log(error);
      }
      // if (error.code === "auth/user-not-found") {
      //   alert("incorrect email or password");
      // }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };



  return (
    <div>
      <h2>Already have an account?</h2>
      <form onSubmit={handleSubmit} action="">
        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />
        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type='button' ButtonType="google" onClick={signInWithGoogle}>Google Sign In</Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
