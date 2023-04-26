import React from "react";
import { Typography, Divider, Row, Col, Space } from "antd";
import { TwitterCircleFilled, InstagramFilled, FacebookFilled } from "@ant-design/icons";

const Footer = () => {

    const getYear = new Date().getFullYear();

    return(
        <footer>
           <Divider />

         
            <Row>
                <Col>
                    <Typography.Paragraph style={{ color: "gray" }}>© {getYear} Game Store, Inc</Typography.Paragraph>
                </Col>
                <Col style={{ marginLeft: "auto" }}>
                   <Space>
                        <TwitterCircleFilled style={{ fontSize: "30px", color: "gray"}} />
                        <InstagramFilled style={{ fontSize: "30px", color: "gray"}} />
                        <FacebookFilled style={{ fontSize: "30px", color: "gray"}} />
                   </Space>
                </Col>
            </Row>
            
        </footer>
    );
}

export default Footer;