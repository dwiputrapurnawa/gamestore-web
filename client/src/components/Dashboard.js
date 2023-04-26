import React, { useEffect, useState } from "react";
import "../css/master.css";
import { Menu, Layout, Space, Button, Breadcrumb, Input, Typography, Table, Modal, Form, message, Spin, Image} from "antd";
import { DashboardOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ShopOutlined, EditOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import DashboardUser from "./Dashboard_User";
import DashboardProduct from "./Dashboard_Product";
import DashboardAdmin from "./Dashboard_Admin";
import logo from "../images/logo.png"

const Dashboard = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [currentMenu, setCurrentMenu] = useState();
  
    const menuItems = [
        {
            label: "Dashboard",
            key: "Dashboard",
            icon: <DashboardOutlined />

        },
        {
            label: "Product",
            key: "Product",
            icon: <ShopOutlined />
        },
        {
            label: "User",
            key: "User",
            icon: <UserOutlined />,
        },
        {
            label: "Admin",
            key: "Admin",
            icon: <UserOutlined />,
        },
    ]
    

   
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    }

    const onClickMenu = (e) => {
        setCurrentMenu(e.key);
    }

 
   

    return(

         <Layout style={{ height: "100vh",}}>
            
            <Layout.Sider collapsed={collapsed}>
                <Image  src={logo} style={{ padding: "1rem" }} preview={false} />
    
                <Menu theme="dark" mode="inline" items={menuItems} onClick={onClickMenu} selectedKeys={[currentMenu]} />
            </Layout.Sider>
            <Layout>
                <Layout.Header style={{ background: "white" }}>{collapsed ? <MenuUnfoldOutlined style={{ fontSize: "20px" }} onClick={toggleCollapsed} /> : <MenuFoldOutlined style={{ fontSize: "20px" }} onClick={toggleCollapsed} />}</Layout.Header>
                <Breadcrumb style={{ margin: "24px 16px 0" }} items={[{title: "Dashboard"}, {title: currentMenu}]} />
                <Layout.Content style={{ margin: "24px 16px 0", overflow: "auto" }}>
                <div style={{ padding: 24, background: "white" }}>


                {currentMenu === "User" ? <DashboardUser /> : null}

                {currentMenu === "Product" ? <DashboardProduct /> : null}

                {currentMenu === "Admin" ? <DashboardAdmin /> : null}
                
        


                </div>
                </Layout.Content>
            
            </Layout>
        </Layout>

    );
}

export default Dashboard;