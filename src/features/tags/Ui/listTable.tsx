import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Table, Input, Popconfirm, Form, Typography, Space, Tag, Select, Alert, Avatar, message} from 'antd';
import {RootS, RootState} from 'app/rootReducer';
import {fetchTags, deleteOne} from "../tags.reducer";
import AddEditTag from "./AddUpdate";
import {setTag} from '../tags.reducer'


import {TagsModel} from "../tagsModel";

const ListTable = () => {
    const dispatch = useDispatch()
    const {  tags, tag, error, loadingStatus, queryType} = useSelector(
        (state: RootS) => state.tags
    )
    const [single, setSingle] = useState({});
    // if ("name" in tag) {
    //     console.log("ztag is", tag.name,)
    // }
    const [queryCtr, setQueryCtr]=useState(0)
    useEffect(() => {
        if (tags.length < 1&&queryCtr<5) {
            dispatch(fetchTags())
            setQueryCtr(queryCtr+1)
            // dispatch(LOG_g("questions", questions))
        }
        // Since we may have the issue already, ensure we're scrolled to the top
        window.scrollTo({top: 0})
    }, [dispatch, tags])



    const [form] = Form.useForm();
    const [editModalOpen, setEditModal]= useState(false);

    const Delete = (record) => {
        dispatch(deleteOne(record._id))
    };

    const columns = [
        // {
        //     // title:'image',
        //     dataIndex:'image',
        //     render:image=>(
        //         <Avatar size={64} src={image?image.imagePath +image.imageCover+image.suffix:""} />
        //     )
        // },
        {
            title: 'name',
            dataIndex: 'name',
            width: '40%',

        },

        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: TagsModel) => {
                return (
                    <Space size={"middle"}>
                        <Typography.Link disabled={editModalOpen ===true} onClick={() => {
                            // message.info("hi");

                            dispatch(setTag(record));
                            setSingle(record)
                            // <Alert message="Success Text" type="success" />
                            setEditModal(true )
                        }}>
                        Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={()=>Delete(record)}>
                            <a >  Delete</a>
                        </Popconfirm>
                    </Space>

                );
            },
        },
    ];
    return (
        <>
            <AddEditTag isOpen={editModalOpen}  onClose={()=>setEditModal(false)} isUpdate={true}/>


            {/*<AddQuestion id={editingKey} editMode={true} isOpen={modalOpen} onClose={()=>setModal(false)}/>*/}
            <Form form={form} component={false}>
                <Table
                   bordered
                    dataSource={tags}
                    columns={columns}
                    rowClassName="editable-row"
                    // pagination={{
                    //     onChange: cancel,
                    // }}
                />
            </Form>
        </>

    );
};

export default ListTable;


