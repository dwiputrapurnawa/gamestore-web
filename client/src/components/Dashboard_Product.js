import React, { useEffect, useState } from "react";
import {Table, Space, Button, Input, Modal, Form, InputNumber, Select, Upload, message, Tag, Image, Typography} from "antd";
import {PlusOutlined, EditOutlined, DeleteOutlined, EditFilled, CloseOutlined} from "@ant-design/icons";
import _ from "lodash";

const DashboardProduct = () => {

    const [products, setProducts] = useState([]);
    const [rowSelectionType, setRowSelectionType] = useState("checkbox");
    const [rowSelectionKeys, setRowSelectionKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState();
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [product, setProduct] = useState({
        title: "",
        price: 0,
        tags: [],
        platform: "",
        img: []
    });

    const formatterCurrency = new Intl.NumberFormat("en-ID", {
        style: "currency",
        currency: "IDR"
    });

    const resetProduct = () => {
        setProduct({
            title: "",
            price: 0,
            tags: [],
            platform: "",
            img: []
        });
    }

    const changeToEditMode = () => {
        setRowSelectionType("radio")
    }

    const changeToCheckbox = () => {
        setRowSelectionType("checkbox")
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        
        setProduct(prevVal => {
            return {
                ...prevVal,
                [name]: value
            }
        });
        
    };

    const handleOnChangeEdit = (e) => {
        const { name, value } = e.target;
        
        setSelectedRow(prevVal => {
            return {
                ...prevVal,
                [name]: value
            }
        });
        
    };

    const onChangePrice = (value) => {
        setProduct(prevVal => {
            return {
                ...prevVal,
                "price": value
            }
        })
    };

    const onChangePriceEdit = (value) => {
        setSelectedRow(prevVal => {
            return {
                ...prevVal,
                "price": value
            }
        })
    };

    const onChangeTags = (value) => {
        setProduct(prevVal => {
            return {
                ...prevVal,
                "tags": value
            }
        })
    }

    const onChangeTagsEdit = (value) => {
        setSelectedRow(prevVal => {
            return {
                ...prevVal,
                "tags": value
            }
        })
    }

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      };
    
    const columns = [
        {
            title: "Thumbnail",
            dataIndex: "img",
            render: (_, {img}) => {
                return <Image width={200} src={img[0].url} />
            }
        },
        {
            title: "Title",
            dataIndex: "title"
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (_, {price}) => {
                return formatterCurrency.format(price)
            }
        },
        {
            title: "Tags",
            dataIndex: "tags",
            render: (_, {tags}) => (
                <>
                {tags.map(tag => {
                    return <Tag key={tag} color="geekblue">
                        {tag}
                    </Tag>
                })}
                </>
            ) 
        },
    ];

    const deleteImage = async (filename) => {
        const url = "http://localhost:35033/v1/api/image";
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({filename: filename}),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(data);

    }

    const uploadProps = {
        name: "file",
        action: "http://localhost:35033/v1/api/image",
        listType: "picture-card",
        onPreview: onPreview,
        headers: {
            authorization: "authorization-text"
        },
        onChange(info) {
            if(info.file.status === "done") {
                setProduct(prevVal => {

                    const fileImg = {
                        uid: info.file.uid,
                        name: info.file.name,
                        url: "http://localhost:35033/" + info.file.name
                    };

                    prevVal.img.push(fileImg);

                    return {
                        ...prevVal,
                    }
                })
            }
        },
        async onRemove(file) {
            setProduct(prevVal => {
                
                prevVal.img = _.reject(prevVal.img, (item) => {
                    return item.name === file.name
                })

                return {
                    ...prevVal
                }
            })
            await deleteImage(file.name);
        }
    }

    const editUploadProps = {
        name: "file",
        action: "http://localhost:35033/v1/api/image",
        listType: "picture",
        onPreview: onPreview,
        headers: {
            authorization: "authorization-text"
        },
        onChange(info) {
            

            // setSelectedRow(prevVal => {
            //     return {
            //         ...prevVal,
            //         img: info.fileList
            //     }
            // })

            // if(info.file.status === "done") {

            //     setSelectedRow(prevVal => {

            //         const fileImg = {
            //             uid: info.file.uid,
            //             name: info.file.name,
            //             url: "http://localhost:35033/" + info.file.name
            //         };

            //         prevVal.img.push(fileImg);

            //         return {
            //             ...prevVal,
            //         }
            //     })
            // }
        },
        async onRemove(file) {
            setSelectedRow(prevVal => {
                
                prevVal.img = _.reject(prevVal.img, (item) => {
                    return item.name === file.name
                })

                return {
                    ...prevVal
                }
            })
            await deleteImage(file.name);
        },
        fileList: selectedRow?.img
    }

    const handleRowSelectionOnChange = (key, row) => {
        setRowSelectionKeys(key);
        if(row[0]) {
            setSelectedRow({
                _id: row[0]._id,
                title: row[0].title,
                price: row[0].price,
                img: row[0].img,
                tags: row[0].tags
            });
        } else {
            setSelectedRow();
        }
    }

    const toggleAddModalOpen = () => {
        setAddModalOpen(!addModalOpen);
    }

    const toggleEditModalOpen = () => {
        setEditModalOpen(!editModalOpen);
    }

    const addProduct = async () => {
        const url = "http://localhost:35033/v1/api/product";
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(data);

        if(data.success) {
            message.success(data.message);
        } else {
            message.error(data.message)
        }

        resetProduct();

    }

    const getProduct = async () => {
        const url = "http://localhost:35033/v1/api/product";
        const options = {
            method: "GET",
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success) {
            setProducts(data.products);
        } else {
            message.error(data.message)
        }
    }

    const deleteProduct = async () => {
        const url = "http://localhost:35033/v1/api/product";
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({rowSelectionKeys: rowSelectionKeys}),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if(data.success) {
            message.success(data.message);
        } else {
            message.error(data.message)
        }
    } 

    const editProduct = async () => {
        const url = "http://localhost:35033/v1/api/product";
        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(selectedRow),
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(data);

        if(data.success) {
            message.success(data.message)
        } else {
            message.error(data.message)
        }
    }

    const onSearchTitle = async (value) => {
        const url = "http://localhost:35033/v1/api/product?search=" + value;
        const options = {
            method: "GET",
            credentials: "include"
        };

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(data);

        if(data.success) {
            setProducts(data.products)
        } 
    }

    useEffect(() => {
        getProduct();
    }, [])

    

    return(
        <>

        <Space direction="vertical" style={{ width: "100%" }}>
        
            <Space>
                <Button onClick={toggleAddModalOpen}><PlusOutlined /> Add</Button>
                {rowSelectionType === "checkbox" ? <Button disabled={selectedRow ? false : true} onClick={changeToEditMode}><EditOutlined /> Edit</Button> : <>
                <Button onClick={toggleEditModalOpen}><EditFilled/> Edit Selected Product</Button>
                <Button onClick={changeToCheckbox}><CloseOutlined /> Cancel Edit Mode</Button>
                </>}
                <Button onClick={deleteProduct} disabled={rowSelectionKeys.length != 0 ? false : true}><DeleteOutlined /> Delete</Button>
                <Input.Search placeholder="Search..." onSearch={onSearchTitle} />
            </Space>

            <Modal open={addModalOpen} onCancel={toggleAddModalOpen} onOk={addProduct}>

                <Typography.Title level={3}>Add Product</Typography.Title>

                <Form labelCol={{ span: 3 }}>

                <Form.Item label="Image">
                <Upload {...uploadProps}>
                    <Space direction="vertical">
                        <PlusOutlined />
                        Upload
                    </Space>
                        
                    </Upload>
                </Form.Item>

                    <Form.Item label="Title">
                        <Input name="title" onChange={handleOnChange} value={product.title} />
                    </Form.Item>

                    <Form.Item label="Price">
                        <InputNumber prefix="IDR" style={{ width: "100%" }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value.replace(/\$\s?|(,*)/g, '')} name="price" onChange={onChangePrice} value={product.price}  />
                    </Form.Item>

                    <Form.Item label="Tags">
                        <Select mode="tags" onChange={onChangeTags} value={product.tags} />
                    </Form.Item>
                </Form>


            </Modal>


              <Modal open={editModalOpen} onCancel={toggleEditModalOpen} onOk={editProduct}>

                <Typography.Title level={3}>Edit product</Typography.Title>

                <Form labelCol={{ span: 3 }}>

                <Form.Item label="Image">
                    <Upload {...editUploadProps}>
                        <Space direction="vertical">
                            <Button>Upload</Button>
                        </Space>
                            
                    </Upload>
                </Form.Item>

                    <Form.Item label="Title">
                        <Input name="title" onChange={handleOnChangeEdit} value={selectedRow ? selectedRow.title : null} />
                    </Form.Item>

                    <Form.Item label="Price">
                        <InputNumber prefix="IDR" style={{ width: "100%" }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value.replace(/\$\s?|(,*)/g, '')} name="price" onChange={onChangePriceEdit} value={selectedRow ? selectedRow.price : null} />
                    </Form.Item>

                    <Form.Item label="Tags">
                        <Select mode="tags" onChange={onChangeTagsEdit} value={selectedRow ? selectedRow.tags : null} />
                    </Form.Item>
                </Form>


            </Modal>
            

            <Table rowSelection={{ type: rowSelectionType, onChange: handleRowSelectionOnChange}} columns={columns} dataSource={products} rowKey="_id" />
        </Space>

       
        </>
    );
}

export default DashboardProduct;