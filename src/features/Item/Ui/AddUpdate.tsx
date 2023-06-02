import React,{useEffect, useState} from "react";
import {
    Button,
    Form,
    Input,
    message,
    Modal,
    Typography,
    Upload,
    Spin,
    InputNumber,
    Row,
    Col,
    Select, Checkbox,
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {createItems, updateItems} from "../item.reducer";
import {beforeUpload, getBase64, isJpgOrPng} from "../../../utils/image-util";

import {Query, Status} from "../../../utils/utils";
import {RootS, RootState} from "../../../app/rootReducer";
import {AuthState} from "../../auth/auth.model";
import {selectAuth} from "../../auth/auth.selectors";

const { Option } = Select;

const AddEditBook = ({ isOpen, onClose, isUpdate }) => {
    const rootState = useSelector(
        (state:RootS) => state
    )
    const { item, error, loadingStatus, queryType} = rootState.items
    let validQuery= !!(queryType === Query.CREATE || Query.UPDATE)
    let loading = loadingStatus === Status.LOADING && validQuery
    // @ts-ignore
    const { tags} = rootState.tags

    const authStatus:AuthState =selectAuth(rootState);
    const CurrentUser=authStatus.currentLoggedInUser
    const dispatch = useDispatch();
    const [formRef] = Form.useForm();



        //Update item Use Effect
        useEffect(() => {
            if(isUpdate){
                formRef.setFieldsValue(item);
            }
        }, [item]);

    const cleanUp=()=>{
        onClose()
        formRef.resetFields()
    }
    const handleSubmit = (values) => {
        const formData = new FormData();
        console.log("values=", values)

            let formBody = {
                title: values.name,
                body: values.description,
                ownerId:"",
                tags: values.tags,
                type: values.type

            }
        if ("_id" in CurrentUser) {
            formBody.ownerId= CurrentUser._id
        }
            if ("_id" in item && isUpdate){
                dispatch(updateItems(item._id, formBody, cleanUp))
            }else if(!isUpdate){
                dispatch(createItems(formBody, cleanUp))
            }

            // formData.append("name", values.name);
            // formData.append("description", values.description)
            // formData.append("language", values.language)
            // formData.append("type", values.type)
            //
            // formData.append("booksAmount", values.booksAmount||1)
            //
            // formData.append("available", values.available)
            // formData.append("tags", values.tags)




    };



    return (
        <>
            <Modal
                title={isUpdate?"Update ":"Create "}
                visible={isOpen}
                onOk={handleSubmit}
                onCancel={onClose}
                footer={[]}
            >
                <Form initialValues={{}} form={formRef} onFinish={handleSubmit}>
                    {/*------------------   =======  name  ========== --------------------*/}
                    <Form.Item name="name"  rules={[{ required: true, message: "Please input !" }]}          >
                        <Input size="large" placeholder=" title " value={"title" in item ? item.title :""}  />
                    </Form.Item>

                    {/*Language & type*/}
                    <Row gutter={16}>

                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[{ required: true, message: "type is required" }]}
                            >
                                <Select placeholder="Please choose the type">
                                    <Option value="question">Question</Option>
                                    <Option value="article">Article</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/*Tags & tags*/}
                    <Form.Item>
                        <Input.Group>
                            {/*This works in 24 partitions*/}
                            <Row gutter={12}>

                                <Col span={18}>
                                    <Form.Item label={"Tags"}  name="tags">
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="select Tags "
                                            // defaultValue={[]}
                                            // onChange={handleChange}
                                        >
                                            {tags.map(tag=>{
                                                return <Option key={tag._id} value={tag.name}>{tag.name}</Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Input.Group>
                    </Form.Item>
                    {/*  available*/}
                    <Form.Item>
                        <Input.Group>
                            <Row gutter={12}>

                                <Col span={8}>
                                    <Form.Item valuePropName="checked" name="active">
                                        <Checkbox name="active" defaultChecked={true} >Make it Active</Checkbox>
                                    </Form.Item>

                                </Col>
                            </Row>
                        </Input.Group>
                    </Form.Item>







                    {/*   ------------------      * description     ----------------------*/}
                    <Form.Item name="description"
                               rules={[
                                   { required: true, message: "Please input body!" },
                               ]}
                    >
                        <Input.TextArea rows={10} placeholder="Body" defaultValue={"body" in item ? item.body :""}/>
                    </Form.Item>




                    {/* -- ===== Submit Button ```````````*/}
                    <Form.Item>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            {loading?<Spin />:<Button
                                type="primary"
                                htmlType="submit"
                                style={{width: "150px"}}
                            >
                                {isUpdate?"Update ":"Create "}
                            </Button>}
                        </div>
                    </Form.Item>

                </Form>
            </Modal>

        </>
    );
};

export default AddEditBook;

