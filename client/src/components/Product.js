import React from "react";
import { Card, Typography } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import "../css/master.css";

const Product = (props) => {
    return(
        <Card className='card-container' cover={<img className='card-img' src="https://assets-prd.ignimgs.com/2022/07/06/god-of-war-ragnarok-preorder-1657118252407.png?width=1280" alt="" />}>
        <Typography.Title level={5}>{props.title}</Typography.Title>
        
        <Typography.Title level={5}>{props.price}</Typography.Title>
        
        {props.wishlist ? <HeartFilled onClick={props.toggle} style={{ fontSize: "20px", color: "#AB000E", float: "right" }}/> : <HeartOutlined onClick={props.toggle} style={{ fontSize: "20px", color: "#AB000E", float: "right" }}/>}
      
      </Card>
    );
}

export default Product;
