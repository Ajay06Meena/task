import React, { useState, useEffect } from "react";
import { Select, Button, Row, Col, Card } from "antd";
import moment from "moment-timezone";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
const { Option } = Select;

const ProfilePage = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [clockRunning, setClockRunning] = useState(false);
  const [pausedTime, setPausedTime] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const userDetails = state.user;
  const posts = state.posts;
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };
  useEffect(() => {
    axios
      .get("http://worldtimeapi.org/api/timezone")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`https://worldtimeapi.org/api/timezone/${selectedCountry}`)
        .then((response) => {
          const timezone = response.data.timezone;
          const dateTime = moment.tz(response.data.datetime, timezone);
          const newUnixTime = dateTime.valueOf();
          setPausedTime(null);
          setCurrentTime(newUnixTime);
          setClockRunning(true);
        })
        .catch((error) => {
          console.error("Error fetching current time:", error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (clockRunning) {
        let timeCheck = currentTime + 1000;
        setCurrentTime(timeCheck);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTime, clockRunning]);

  const handleCountryChange = (value) => {
    setPausedTime(null);
    setSelectedCountry(value);
  };

  const toggleClock = () => {
    if (clockRunning) {
      setPausedTime(currentTime);
      setCurrentTime(currentTime);
    } else {
      setCurrentTime(currentTime);
    }
    setClockRunning(!clockRunning);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button
            onClick={() => {
              navigate("/");
            }}
            style={{ width: "50%" }}
          >
            Back
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            style={{ width: "50%" }}
            onChange={handleCountryChange}
            placeholder="Select a country"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {countries.map((country, index) => (
              <Option key={index} value={country}>
                {country}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h2 style={{ margin: "0px" }}>
            Clock:{" "}
            {currentTime
              ? moment(currentTime).tz(selectedCountry)?.format("hh:mm:ss A")
              : ""}
          </h2>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button
            style={{ width: "50%", marginBottom: "10px" }}
            onClick={toggleClock}
          >
            {clockRunning ? "Pause" : "Start"}
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="User Details" style={{ border: "1px solid black" }}>
            <p>Name: {userDetails.name}</p>
            <p>Username: {userDetails.username}</p>
            <p>Catch Phrase: {userDetails.company.catchPhrase}</p>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Address" style={{ border: "1px solid black" }}>
            <p>{userDetails.address.city}</p>
            <p>Email: {userDetails.email}</p>
            <p>Phone: {userDetails.phone}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {posts.map((post) => (
          <Col key={post.id} xs={24} sm={24} md={12} lg={8}>
            <Card
              title={post.title}
              style={{ border: "1px solid black" }}
              onClick={() => handlePostClick(post)}
            >
              <p>{post.body}</p>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedPost && <Modal post={selectedPost} onClose={closeModal} />}
    </div>
  );
};

export default ProfilePage;
