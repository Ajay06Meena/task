import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const UserListPage = () => {
  const [userList, setUserList] = useState([])
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then(function (response) {
        setUserList(response?.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts/`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handler = (user, posts) => {
    navigate(
        'profile',
        {
          state: {
            user,
            posts
          }
        }
      )
  }

  return (
    <div style={{ margin: "40px" }} >
      <h1>User list</h1>
      <Row gutter={[16, 16]}>
        {userList.map((user) => {
            const filteredPosts = posts.filter(post => post.userId === user.id);
            return (
          <Col key={user.id} xs={24} sm={12} md={24} lg={24}>
            <Card style={{ border: "1px solid black" }} onClick={() => {handler(user, filteredPosts)}} type="button">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontWeight: "bold" }}> Name: {user.name}</p>
                </div>
                <div>
                  <p>{`Posts: ${filteredPosts.length}`}</p>
                </div>
              </div>
            </Card>
          </Col>
        )})}
      </Row>
    </div>
  );
};

export default UserListPage;
