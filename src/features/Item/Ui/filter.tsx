import {Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Spin, Switch} from 'antd';
import {FilterTwoTone, PlusOutlined} from '@ant-design/icons';
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootS, RootState} from "../../../app/rootReducer";
import {Query, Status} from "../../../utils/utils";

import {fetchItems} from "../item.reducer";
import {ItemFilter} from "../itemModel";


const { Search } = Input;
const { Option } = Select;

export const FilterDrawer =()=> {
    const [visible, setDrawer]= useState(false);

    // const[filter, setFilter] = useState({})

    const dispatch = useDispatch();
    const { items,item, error, loadingStatus, queryType, filter} = useSelector(

        (state:RootS) => state.items
    )
    let validQuery= (queryType === Query.FETCH)
    let loading = loadingStatus === Status.LOADING && validQuery
    const showDrawer = () => {
        setDrawer(true)
    };
    const { tags} = useSelector(
        (state: RootS) => state.tags
    )
   const onClose = () => {
        setDrawer(false)
    };
    const [switc, setSwitch] = useState(false);
    const onSwitchChange = (e) => {
        console.log('switch checked', e);
        setSwitch(e);
    };
    const handleSubmit = (values) => {
        const query:ItemFilter= {
            ...filter,

            type: values.type,
            tags: values.tags,
            page:1,
            lastPageReached: false,
            active:switc,

        }
        dispatch(fetchItems(query, onClose))
    }
    const handleSearch = (values) => {
        const query:ItemFilter= {
            ...filter,
            search:values,
            page:1,
            lastPageReached: false
        }
        dispatch(fetchItems(query, onClose))
    }
        return (
            <>
                <Button type="primary" onClick={()=>setDrawer(true)} icon={<FilterTwoTone />}>
                    Filter
                </Button>
                {/*<FilterTwoTone  />*/}
                <Drawer
                    title="filter content"
                    width={720}
                    onClose={onClose}
                    visible={visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            {/*<Button onClick={onClose} type="primary">*/}
                            {/*    Submit*/}
                            {/*</Button>*/}
                        </Space>
                    }
                >
                    <Form layout="vertical" onFinish={handleSubmit}   hideRequiredMark>

                        <Search
                            placeholder="input search text"
                            enterButton="Search"
                            size="large"
                            // suffix={suffix}
                            onSearch={handleSearch}
                        />
                        {/*Language & type*/}
                        <Row gutter={16}>

                            <Col span={12}>
                                <Form.Item
                                    name="type"
                                    label="Type"
                                    rules={[]}
                                >
                                    <Select placeholder="Please choose the type">
                                        <Option value="article">Article</Option>
                                        <Option value="question">Question</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/*Tags & availabel*/}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={"Tags"} rules={[]} name="tags">
                                    <Select
                                        // mode="multiple"
                                        // allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Tags"
                                        // defaultValue={['a10', 'c12']}
                                        // onChange={handleChange}
                                    >
                                        {tags.map(tags=>{
                                            return <Option key={tags._id} value={tags.name} >{tags.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Form.Item valuePropName="checked"
                                       label="only active"
                                       name="active"
                            >
                                <Switch checked={switc} onChange={onSwitchChange} />
                            </Form.Item>
                        </Row>

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
                                    {"Filter Books"}
                                </Button>}
                            </div>
                        </Form.Item>
                    </Form>

                </Drawer>
            </>
        );
    }

export default FilterDrawer;

