import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  ProgressBar,
  Image,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosIntercept";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateCurrPassword, updateCurrEmail } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [xp, setXp] = useState(0);
  const [xpMax, setXpMax] = useState(500);
  const [profileName, setProfileName] = useState("");

  const history = useNavigate();

  // Fetch XP and profile info from Django
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = await currentUser.getIdToken();
        const response = await axiosInstance.get("/user-profile/", {});
        const { xp, profile_name } = response.data;
        setXp(xp);
        console.log("This is the response:", response);
        console.log("This is the xp", xp);
        console.log("This is the profile name", profile_name);
        setProfileName(profile_name);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        setError("Failed to load profile data.");
      }
    }

    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const xpProgress = Math.min((xp / xpMax) * 100, 100);

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords don't match!");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateCurrEmail(emailRef.current.value));
    }

    if (passwordRef.current.value) {
      promises.push(updateCurrPassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        setEditMode(false);
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Card>
          <Card.Body className="text-center">
            {/* Profile Picture -- we respect Jimmy Lee our Mentor */}
            <Image
              src="/jimmy-lee.png"
              roundedCircle
              className="mb-3"
              alt="User Avatar"
              width={80}
            />
            <h4 className="mb-1">{profileName || currentUser.email}</h4>

            {/* XP Progress Bar -- Chicken Jockey */}
            <div className="text-start mt-3">
              <strong>XP:</strong> {xp} / {xpMax}
              <ProgressBar
                now={xpProgress}
                label={`${Math.floor(xpProgress)}%`}
                className="mt-1"
              />
            </div>

            <hr />

            <h5 className="text-center mb-4">
              {editMode ? "Edit Profile" : "View Profile"}
            </h5>
            {error && <Alert variant="danger">{error}</Alert>}

            {editMode ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                    defaultValue={currentUser.email}
                  />
                </Form.Group>
                <Form.Group id="password" className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Form.Group id="password-confirm" className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Button disabled={loading} className="w-100 mb-2" type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </Form>
            ) : (
              <>
                <p>
                  <strong>Password:</strong> ********
                </p>
                <Button
                  className="w-100 mb-2"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
                <Link
                  to="/dashboard"
                  className="btn btn-outline-secondary w-100"
                >
                  Back to Dashboard
                </Link>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
