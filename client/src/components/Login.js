import React, { useState } from "react";
import {Button, Checkbox, Form, Input, Typography} from 'antd';
import { useNavigate } from "react-router-dom";
import "../css/master.css";

const Login = () => {

    const [exception, setException] = useState({
        error: false,
        message: ""
    })
    const navigate = useNavigate();

    const login = async (value) => {
        
        const url = "http://localhost:35033/v1/api/login";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value),
            credentials: "include",
        }

        const response = await fetch(url, options);

        const data = await response.json();

        if(data.success) {
            navigate("/")
        } else {
            setException({
                error: true,
                message: data.message
            })
        }

    }

    return(
        <Form className="form-container" name="login"  labelCol={{ span: 8,}} wrapperCol={{ span: 16,}} style={{ maxWidth: 600,}} initialValues={{ remember: true,}} onFinish={login}>

            {exception.error && <h1>{exception.message}</h1>}

            <Form.Item wrapperCol={{ offset: 8 }}>
                <Typography.Title>Sign In</Typography.Title>
            </Form.Item>

            <Form.Item label="Username" name="username">
                <Input />
            </Form.Item>

            <Form.Item label="Password" name="password">
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16,}}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item  wrapperCol={{ offset: 8, span: 16,}}>
                <Button type="primary" htmlType="submit">Login</Button>
            </Form.Item>

        </Form>
    );
}

export default Login;