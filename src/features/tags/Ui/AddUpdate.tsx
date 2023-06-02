import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Typography, Upload, Spin, InputNumber, Row, Col, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";

import {createOne, fetchTags, updateOne} from "../tags.reducer";

import {Query, Status} from "../../../utils/utils";
import {RootS, RootState} from "../../../app/rootReducer";

const {Option} = Select;

const AddEditTag = ({isOpen, onClose, isUpdate}) => {

    const {tags, tag, error, loadingStatus, queryType} = useSelector(
        (state: RootS) => state.tags
    )
    const [single, setSingle] = useState({name:""});
    if ("name" in tag) {
        console.log("====>>", tag.name)
    }

    const dispatch = useDispatch();
    const [formRef] = Form.useForm();

    let validQuery = !!(queryType === Query.CREATE || Query.UPDATE)
    let loading = loadingStatus === Status.LOADING && validQuery

    useEffect(() => {
        if(isUpdate){
            formRef.setFieldsValue(tag);

        }

    }, [tag]);
    const cleanUp = () => {
        onClose()
        formRef.resetFields()
    }
    const handleSubmit = (values) => {
        const formData = new FormData();

        formData.append("name", values.name);
        let formBody = {name: values.name}
        if ("_id" in tag && isUpdate) {
            dispatch(updateOne(tag._id, formBody, cleanUp))
        } else if (!isUpdate) {
            dispatch(createOne(formBody, cleanUp))
        }
        // }
    };



    return (
        <>
            <Modal
                title={isUpdate ? "Update Tag" : "Create Tag"}
                visible={isOpen}
                onOk={handleSubmit}
                onCancel={onClose}
                footer={[]}
            >
                <Form initialValues={{}} form={formRef} onFinish={handleSubmit}>
                    {/*------------------   =======  name  ========== --------------------*/}
                    <Form.Item name="name" rules={[{required: true, message: "Please input tag name!"}]}>

                        <Input size="large" placeholder="Tag Name" value={"name" in single ? single.name : ""}/>
                    </Form.Item>


                    {/* -- ===== Submit Button ```````````*/}
                    <Form.Item>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            {loading ? <Spin/> : <Button
                                type="primary"
                                htmlType="submit"
                                style={{width: "150px"}}
                            >
                                {isUpdate ? "Update Tag" : "Create Tag"}
                            </Button>}
                        </div>
                    </Form.Item>

                </Form>
            </Modal>

        </>
    );
};

export default AddEditTag;

