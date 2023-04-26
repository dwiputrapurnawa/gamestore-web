import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined, DeleteOutlined, SyncOutlined } from "@ant-design/icons";

const DashboardAdmin = () => {

    const [admins, setAdmins] = useState([]);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isDisabled, setIsDisabled] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [disabledCheckButton, setDisabledCheckButton] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [admin, setAdmin] = useState({
        username: "",
        password: "",
        role: ""
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setAdmin((prevVal) => {
            return {
                ...prevVal,
                [name]: value
            }
        })

    }

    const showMessage = (messageText, type, duration = 3) => {
        messageApi.open({
            type: type,
            content: messageText,
            duration: duration
        })
    }

    const handleOnChangeSelect = (value) => {
        setAdmin((prevVal) => {
            return {
                ...prevVal,
                role: value
            }
        })
    }

    const columns = [
        {
            title: "Username",
            dataIndex: "username"
        },
        {
            title: "Role",
            dataIndex: "role"
        }
    ]

    const roleOptions = [
        {
            value: "Admin", 
            label: "Admin"
        },
        {
            value: "Super Admin",
            label: "Super Admin"
        }
    ]

    const getAdmins = async () => {
        const url = "http://localhost:35033/v1/api/admin";
        const options = {
            method: "GET",
            credentials: "include"
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success) {
            setAdmins(data.admins);
        }
    }

    const toggleOpenAdd = () => {
        setIsOpenAdd(!isOpenAdd);
    }

    const checkUsernameAdmin = async () => {
        const url = "http://localhost:35033/v1/api/checkusername";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username: admin.username, role: "admin"}),
            credentials: "include"
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.usernameExist) {
            setIsValid(false)
            showMessage(data.message, "error");
        } else {
            setIsValid(true);
            showMessage(data.message, "success");
        }


    }

    const addAdmin = async () => {
        const url = "http://localhost:35033/v1/api/admin";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(admin),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success) {
            showMessage(data.message, "success")
            setAdmin((prevVal) => {
                return {
                    ...prevVal,
                    username: "",
                    password: ""
                }
            });
            getAdmins();
        } else {
            showMessage(data.message, "error")
        }
    }

    const rowSelectionOnChange = (keys) => {
        setSelectedKeys(keys)
    }

    const deleteAdmin = async () => {
        const url = "http://localhost:35033/v1/api/admin";
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({selectedKeys: selectedKeys}),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success) {
            showMessage(data.message, "success");
            getAdmins();
        }

    }

    const validateForm = () => {
       if(admin.username !== "") {
        setDisabledCheckButton(false);
       } else {
        setDisabledCheckButton(true);
        setIsDisabled(true);
        setIsValid(false);
       }

       if(admin.username !== "" && admin.password !== "" && isValid) {
        setIsDisabled(false);
       } else {
        setIsDisabled(true);
       }


    }

    const handleOnSearch = async (value) => {

        const url = "http://localhost:35033/v1/api/admin?search=" + value;
        const options = {
            method: "GET",
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success) {
            setAdmins(data.admins);
        }

    }

    useEffect(() => {
        validateForm();
    }, [admin]);

    useEffect(() => {
        getAdmins();
    }, []);

    return(
        <>
            {contextHolder}
           <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                    <Button onClick={toggleOpenAdd}><PlusOutlined /> Add</Button>
                    <Button onClick={deleteAdmin} disabled={selectedKeys.length !== 0 ? false : true}><DeleteOutlined /> Delete</Button>
                    <Button onClick={getAdmins} ><SyncOutlined /> Refresh</Button>
                    <Input.Search placeholder="Search..." onSearch={handleOnSearch} />
                </Space>

                <Modal title="Add Admin" open={isOpenAdd} onCancel={toggleOpenAdd} onOk={addAdmin} okButtonProps={{ disabled: isDisabled }} >

                    <Form labelCol={{ span: 4 }}>
                        <Form.Item label="Username">
                            <Input suffix={<Button onClick={checkUsernameAdmin} disabled={disabledCheckButton} >Check</Button>} name="username" value={admin.username} onChange={handleOnChange} required />
                        </Form.Item>

                    {isValid && <>
                        <Form.Item label="Role">
                            <Select options={roleOptions} onChange={handleOnChangeSelect}/>
                        </Form.Item>

                        <Form.Item label="Password">
                            <Input.Password name="password" value={admin.password} onChange={handleOnChange} />
                        </Form.Item>
                    </>}
                    </Form>
                </Modal>
                <Table rowSelection={{ type: "checkbox", onChange: rowSelectionOnChange}} dataSource={admins} columns={columns} rowKey="_id" />
           </Space>
        </>
    );
}

export default DashboardAdmin;