import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { UserAuth, useAuth } from "../contexts/AuthContext";
import { auth, provider } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import eventHub from "../assets/Event-Hub.png";
import {
  getRedirectResult,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { googleSignIn, currentUser } = UserAuth();
  const history = useNavigate();

  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      setError("Please verify your email before logging in.");
      setLoading(false);
    }
  }, [currentUser]);

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Email:", emailRef.current.value);
    console.log("Password:", passwordRef.current.value);

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      
      // Check if the user's email is verified
      if (!auth.currentUser.emailVerified) {
        setError("Please verify your email before logging in.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      console.log("Current user is: ", currentUser);
      history("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error(error);
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      if (result.user) {
        history("/dashboard");
      }
    });
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="d-flex align-items-center justify-content-center">
          <img src={eventHub} alt="Event Hub" style={{ marginRight: '10px', marginTop: '-9px' }}></img>
          <h1 style={{color:"white"}}></h1>
        </div>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log in </h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button disabled={loading} className="w-100" type="submit">
                Log in
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
        </Card>
        <div style={{ color: "white" }} className="w-100 text-center mt-2">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={handleGoogleSignIn}
        >
          <img src={"./google.png"} width={"80%"} alt="Google Sign-In" />
        </div>
      </div>
    </Container>
  );
}
