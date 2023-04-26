import React, { useEffect, useState } from "react";
import { Menu, Avatar, Input, Typography } from 'antd'
import { UserOutlined, LogoutOutlined, LoginOutlined, HeartOutlined } from "@ant-design/icons"
import { useNavigate, Link } from "react-router-dom"
import "../css/master.css";
  

const Navbar = () => {

  const [isLogin, setLogin] = useState(false);
  const activeLink = window.location.pathname;
  const navigate = useNavigate();


 

  const handleLogout = async () => {
    const url = "http://localhost:35033/v1/api/logout";
    const options = {
      method: "GET",
      credentials: "include",
    }

    const response = await fetch(url, options);
    const data = await response.json();

    console.log(data);

    
    navigate(window.location.pathname);


  }

  const getAuth = async () => {
    const url = "http://localhost:35033/v1/api/getauth";
    const options = {
      method: "GET",
      credentials: "include"
    }

    const response = await fetch(url, options);
    const data = await response.json();

    console.log(data);
    setLogin(data.success);

  }

  useEffect(() => {
    getAuth();
  })

  const menuItems = [
    {
      label: (<Link to={{ pathname: "/"}}>Home</Link>),
      key: "/",
    },
    {
      label: (<Link to={{ pathname: "/store" }}>Store</Link>),
      key: "/store",
    },
    {
      label: (<Input.Search allowClear placeholder="search..."/>),
      key: "search",
      style: {
        paddingTop: "10px",
      },
      className: "remove-bottom-highlight"
    },
    {
      label: (<Avatar icon={<UserOutlined />} />),
      key: "login",
      style: {
        marginLeft: "auto"
      },
      className: "remove-bottom-highlight",
      children: [
        {
          label: (<Typography.Link><HeartOutlined /> Wishlist</Typography.Link>),
          key: "wishlist"
        },
        {
          label: ( isLogin ? <div onClick={handleLogout}><LogoutOutlined /> Logout</div> : <a href="/login"><LoginOutlined /> Login</a>),
          key: "logout"
        }
      ]
    },
  ]

    return(
      <Menu className="menu" selectedKeys={[activeLink]} mode="horizontal" items={menuItems} />
    );
}

export default Navbar;