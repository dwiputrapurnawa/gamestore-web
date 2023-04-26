import React, { useState } from "react";
import Navbar from "./Navbar";
import { Row, Col, Input, Select, Space, Tag, Menu, List, Divider} from "antd";
import Header from "./Header";
import Product from "./Product";
import "../css/master.css"

const Store = () => {

    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleOnSelect = (value) => {
        setSelectedPlatform(value);
    }

    const handleOnCategory = (e) => {
        setSelectedCategory(e.key);
    }

    const data = [
        {
            title: "God of War",
            price: "$69.99"
        },
        {
            title: "The Witcher 3",
            price: "$39.99"
        },
        {
            title: "The Last of US",
            price: "$59.99"
        },
        {
            title: "Monster Hunter Rise",
            price: "$69.99"
        }
    ]

    const platforms = [
        {value: "all", label: "All"},
        {value: "Nintendo Switch", label: "Nintendo Switch"},
        {value: "Playstation 5", label: "Playstation 5"},
        {value: "Playstation 4", label: "Playstation 4"},
        {value: "Xbox Series", label: "Xbox Series"}
    ]

    const menuCategory = [
        {
            label: "Games",
            key: "games",
            children: [
                {
                    label: "Nintendo Switch",
                    key: "nintendo-switch-games"
                },
                {
                    label: "Playstation 5",
                    key: "playstation-5-games"
                },
                {
                    label: "Playstation 4",
                    key: "playstation-4-games"
                },
                {
                    label: "Xbox Series",
                    key: "xbox-series-games"
                },
            ]
        },
        {
            label: "Accessories",
            key: "accessories",
            children: [
                {
                    label: "Nintendo Switch",
                    key: "nintendo-switch-acc"
                },
                {
                    label: "Playstation 5",
                    key: "playstation-5-acc"
                },
                {
                    label: "Playstation 4",
                    key: "playstation-4-acc"
                },
                {
                    label: "Xbox Series",
                    key: "xbox-series-acc"
                },
            ]
        }
    ]

    const tags = [
        "Action", "Adventure", "Survival", "Single Player", "Story Rich"
    ]

    return(
        <div>
            <Navbar />
            
            <div className="content-container">
                <Row gutter={16}>
                    <Col style={{ marginBottom: "1rem" }}>
                       <Space direction="vertical" style={{ display: "flex" }} wrap>
                            <Header text="Search" />
                            <Input.Search />
                            <Select
                            style={{ display: "block" }}
                            onChange={handleOnSelect}
                            defaultValue="Select Platform"
                            options={platforms} />

                            <Header text="Browse By Categories" />
                            <Menu onClick={handleOnCategory} selectedKeys={[selectedCategory]} mode="inline" items={menuCategory} />


                            <Header text="Search By Tags" />
                           <Space size={[0,8]} wrap>
                           {tags.map((item, index) => {
                                return <Tag key={index}>{item}</Tag>
                            })}
                           </Space>
                       </Space>
                       <Divider />
                    </Col>

         
                   <Col lg={16}>

                       <List dataSource={data} grid={{ gutter: 16 }} renderItem={(item) => {
                        return <List.Item><Product title={item.title} price={item.price} /></List.Item>
                       }} />
      
                   </Col>
                    
             
                </Row>

            </div>

        </div>
    );
}

export default Store;