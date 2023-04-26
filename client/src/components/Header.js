import React from "react";
import { Typography } from "antd";
import "../css/master.css";

const Header = (props) => {
    return(
        <div className="gradient-container">
        <Typography.Title level={3} style={{ color: "white", paddingLeft: "1rem", paddingTop: "0.5rem"}}>{props.text}</Typography.Title>
      </div>
    );
}

export default Header;

