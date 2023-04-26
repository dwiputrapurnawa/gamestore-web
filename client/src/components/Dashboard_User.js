import React, { useState, useEffect } from "react";
import { Space, Button, Modal, Form, Table, Input, message, Select, DatePicker } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EditFilled, CloseOutlined, SyncOutlined } from "@ant-design/icons";

const DashboardUser = () => {

    const [selectedKeys, setSelectedKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isDisabled, setIsDisabled] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [rowSelectionMode, setRowSelectionMode] = useState("checkbox");
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        gender: "",
        birthday: "",
    });

    const columns = [
        {
            title: "Username",
            dataIndex: "username"
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Gender",
            dataIndex: "gender"
        },
        {
            title: "Birthday",
            dataIndex: "birthday",
            render: (text) => new Date(text).toLocaleDateString("id-ID")
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (text) => new Date(text).toLocaleDateString("id-ID")
        }
        
    ]

    const gender = [
        {
            label: "Male",
            value: "Male"
        },
        {
            label: "Female",
            value: "Female"
        }
    ];

    const rowSelectionRadio = () => {
        setRowSelectionMode("radio");
    }

    const rowSelectionCheckbox = () => {
        setRowSelectionMode("checkbox");
    }

    const showMessage = (messageText, type, duration = 3) => {
        messageApi.open({
            type: type,
            content: messageText,
            duration: duration
        })
    }

    const onChangeUser = (e) => {
        const {name, value} = e.target;

        setUser((prevVal) => {
            return {
                ...prevVal,
                [name]: value
            }
        });

    }

    const onChangeSelect = (value) => {
        setUser((prevVal) => {
            return {
                ...prevVal,
                gender: value
            }
        })
    }

    const onChangeDatePicker = (dateString) => {
        setUser((prevVal) => {
            return {
                ...prevVal,
                birthday: new Date(dateString)
            }
        })
    }

    const showModal = () => {
        setIsModalOpen(true);
    }

    const cancelModal = () => {
        setIsDisabled(true);
        setIsModalOpen(false);
    }

    const tableOnChange = (key, row) => {
        setSelectedKeys(key);
        setSelectedRow(row);
    }

    const getUsers = async () => {
        const url = "http://localhost:35033/v1/api/user";
        const options = {
            method: "GET",
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success){
            setUsers(data.users);
            
        }

        
    }

    const addUser = async () => {
        showMessage("Loading...", "loading");
        const url = "http://localhost:35033/v1/api/user";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
            credentials: "include"
        }

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(data);

        if(data.success) {
            messageApi.destroy();
            setUser({
                username: "",
                email: "",
                password: "",
                name: "",
                gender: "",
                birthday: "",
                profile: ""
            });

            showMessage(data.message, "success");
            getUsers();
        }

    }

    const deleteUsers = async () => {

        if(selectedKeys.length < 1) {
            showMessage("Select at least one", "error");
        } else {
            const url = "http://localhost:35033/v1/api/user";
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
                setSelectedKeys([]);
                showMessage(data.message, "success");
                getUsers();
            }
        }

        

    }

    const editUser = async () => {
        showMessage("Loading...", "loading");
        const filterUser = {};

        for(let key in user) {
            if(user[key] !== "") {
                filterUser[key] = user[key];
            }
        }

        const url = "http://localhost:35033/v1/api/user";
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({fieldUpdated: filterUser, id: selectedRow[0]._id}),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success) {
            messageApi.destroy();
            showMessage(data.message, "success");
            setUser({
                username: "",
                email: "",
                password: "",
                name: "",
                gender: "",
                birthday: "",
                profile: ""
            });
            getUsers();
        }
    }

    const checkUsername = async () => {
        const url = "http://localhost:35033/v1/api/checkusername";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: user.username, role: "user"}),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.usernameExist) {
            setIsDisabled(true);
            showMessage(data.message, "error");
        } else {
            setIsDisabled(false);
            showMessage(data.message, "success");
        }

    }

    const checkEmail = async () => {
        const url = "http://localhost:35033/v1/api/checkemail";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: user.email, role: "user"}),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.emailExist) {
            setIsChecked(true);
            showMessage(data.message, "error");
        } else {
            setIsChecked(false);
            showMessage(data.message, "success");
        }

    }

    const openModalEdit = () => {
        setIsModalEdit(true);
        console.log(selectedRow[0]);
    }

    const cancelModalEdit = () => {
        setIsModalEdit(false);
    }

    const searchUser = async (value) => {
        const url = "http://localhost:35033/v1/api/user?search=" + value;
        const options = {
            method: "GET",
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success) {
            setUsers(data.users);
        }
    }

    useEffect(() => {
        getUsers();

    },[])

    useEffect(() => {
        if(user.email === "") {
            setIsChecked(false);
        }
    }, [user])

    

    return(
        <>
          {contextHolder}

            <Space style={{ marginBottom: "1rem" }}>
                <Button icon={<PlusOutlined />} onClick={showModal}>Add</Button>
                {rowSelectionMode === "checkbox" ? <Button icon={<EditOutlined />} onClick={rowSelectionRadio}>Edit</Button> :  <Button icon={<EditFilled />} onClick={openModalEdit} disabled={selectedRow.length > 0 ? false : true}>Edit Selected Item</Button>}
                
                {rowSelectionMode === "radio" ?   <Button onClick={rowSelectionCheckbox}><CloseOutlined /> Close Edit Mode</Button> : null}
               
                <Button icon={<DeleteOutlined />} onClick={deleteUsers} disabled={selectedKeys.length !== 0 ? false : true}>Delete</Button>
                <Button onClick={getUsers}><SyncOutlined /> Refresh</Button>
                <Input.Search placeholder="Search..." onSearch={searchUser} />
            </Space>

            <Modal title="Add User" open={isModalOpen} onCancel={cancelModal} onOk={addUser} okButtonProps={{ disabled: isDisabled}}>

                <Form labelCol={{ span: 6 }}>
                    <Form.Item label="Username" >
                        <Input name="username" onChange={onChangeUser} value={user.username} suffix={<Button onClick={checkUsername}>Check</Button>} />
                    </Form.Item>
                    <Form.Item label="Password">
                        <Input.Password name="password" onChange={onChangeUser} value={user.password} />
                    </Form.Item>
                </Form>

            </Modal>

            <Modal title="Edit User" open={isModalEdit} onCancel={cancelModalEdit} onOk={editUser} okButtonProps={{ disabled: isChecked }}  >
                <Form labelCol={{ span: 6 }}>
                    <Form.Item label="Username" >
                        <Input name="username" onChange={onChangeUser} placeholder={selectedRow.length > 0 ? selectedRow[0].username : ''} disabled/>
                    </Form.Item>
                    <Form.Item label="Email" >
                        <Input name="email" onChange={onChangeUser} placeholder={selectedRow.length > 0 ? selectedRow[0].email : ''} value={user.email} suffix={<Button onClick={checkEmail}>Check</Button>} />
                    </Form.Item>
                    <Form.Item label="Name" >
                        <Input name="name" onChange={onChangeUser} placeholder={selectedRow.length > 0 ? selectedRow[0].name : ''} value={user.name} />
                    </Form.Item>
                    <Form.Item label="Gender">
                        <Select options={gender} onChange={onChangeSelect} placeholder={selectedRow.length > 0 ? selectedRow[0].gender : ''} />
                    </Form.Item>
                    <Form.Item label="Birthday">
                        <DatePicker onChange={onChangeDatePicker} placeholder={selectedRow.length > 0 ? new Date(selectedRow[0].birthday).toLocaleDateString("id-ID") : null} />
                    </Form.Item>
                    <Form.Item label="Password">
                        <Input.Password name="password" onChange={onChangeUser} value={user.password} />
                    </Form.Item>
                </Form>
            </Modal>

            <Table rowSelection={{ type: rowSelectionMode, onChange: tableOnChange}} dataSource={users} columns={columns} rowKey="_id" />

        </>
    );
}

export default DashboardUser;