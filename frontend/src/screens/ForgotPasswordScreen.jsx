import React from "react";
import FormContainer from "../components/FormContainer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { UserContext } from "../UserContext";
import { useContext } from "react";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [successSubmit, setSuccessSubmit] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [validatedRequest, setValidatedRequest] = React.useState(false);
  const navigate = useNavigate();

  async function requestPasswordReset(email) {
    const response = await fetch(
      "http://localhost:5000/api/users/password/reset",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );
    const data = await response.json();

    // if successfully sent an email
    if (response.status === 201) {
      toast.success(
        `An email containing a verification code has been sent to ${email}`
      );
      setSuccessSubmit(!successSubmit);
    } else {
      toast.error(data?.message);
      console.log(data?.message);
    }
  }

  async function validateVerificationCode(email, verificationCode) {
    const response = await fetch(
      "http://localhost:5000/api/users/password/reset/verify",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode,
        }),
      }
    );
    const data = await response.json();

    // if successfully verified
    if (response.status === 200) {
      toast.success(`Successfully verified password reset request`);
      setValidatedRequest(!validatedRequest);
    } else {
      toast.error(data?.message);
      console.log(data?.message);
    }
  }

  async function resetPassword(email, verificationCode, newPassword) {
    const response = await fetch(
      "http://localhost:5000/api/users/password/reset",
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          verification_code: verificationCode,
          newPassword: newPassword
        }),
      }
    );
    const data = await response.json();

    // if successfully verified
    if (response.status === 200) {
      toast.success(`Successfully changed password, try logging in`);
      navigate('/login')
    } else {
      toast.error(data?.message);
      console.log(data?.message);
    }
  }


  const submitHandler = (email) => {
    requestPasswordReset(email);
  };

  const verifyCode = (email, verificationCode) => {
    validateVerificationCode(email, verificationCode);
  };

  const changePassword = (email, verificationCode, password, confirmPassword) => {
    // if passwords do not match
    if (password !== confirmPassword) {
      return toast.error('Please ensure your passwords match')
    }
    resetPassword(email, verificationCode, password)

  }

  return (
    <>
      <FormContainer>
        <h2>Forgot password</h2>
        <br />
        <p>
          Please enter in the email of the account you wish to reset the
          password of
        </p>
        <TextField
          required
          label="email"
          onChange={(e) => setEmail(e.target.value)}
          sx={{ margin: 1 }}
        />
        <br />
        {successSubmit && (
          <>
            <TextField
              required
              label="verification code"
              onChange={(e) => setVerificationCode(e.target.value)}
              sx={{ margin: 1 }}
            />
          </>
        )}
        <br />
        {/* If the user has not successfully submitted a request for a verification code */}
        {!successSubmit && !validatedRequest && (
          <Button
            variant="contained"
            color="primary"
            sx={{ margin: 1 }}
            onClick={() => submitHandler(email)}
          >
            Request verification code
          </Button>
        )}
        {/* If the user has requested a verification code but has not verified the code yet */}
        {successSubmit && !validatedRequest && (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: 1 }}
              onClick={() => verifyCode(email, verificationCode)}
            >
              Verify code
            </Button>
          </>
        )}
        {/* User has requested and verified their code, they can now change their password */}
        {successSubmit && validatedRequest && (
          <>
            <TextField
              type="password"
              required
              label="new password"
              sx={{ margin: 1 }}
              onChange={(e) => setPassword(e.target.value)}
            >
              Password
            </TextField>
            <TextField
              type="password"
              required
              label="confirm new password"
              sx={{ margin: 1 }}
              onChange={(e) => setConfirmPassword(e.target.value)}
            >
              Confirm Password
            </TextField>
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: 1 }}
              onClick={() => changePassword(email, verificationCode, password, confirmPassword)}
            >
              Change Password
            </Button>
          </>
        )}
      </FormContainer>
    </>
  );
};

export default ForgotPasswordScreen;
