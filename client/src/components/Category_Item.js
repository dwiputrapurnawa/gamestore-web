import React from "react";
import { Typography, Card } from "antd";


const CategoryItem = (props) => {
    return(
        <Card className="category-item-container" cover={ <img className="card-img" src={props.src} alt="" />}>
            <Typography.Title level={3}>{props.title}</Typography.Title>
        </Card>
    );
}

export default CategoryItem;