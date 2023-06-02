import {Col, Row, Button, Space, Typography} from "antd";
import { PlusCircleTwoTone} from "@ant-design/icons";
import ListTable from "./listTable";

import {useState} from "react";
import AddWithImage from "./AddUpdate";



export const TagsContainer=() =>{
    const [modalOpen, setModal]= useState(false);


    return <div style={{margin: "0 16px"}}>

            <Row justify="space-between" align="stretch" >
                <Col>
                    <h2>Tags</h2>
                </Col>
                <Col>
                    <Button
                        type="default"
                        style={{ width: "150px" }}
                        onClick={() => setModal(true)}
                    >
                        <PlusCircleTwoTone />
                        Add Tag
                    </Button>
                </Col>

            </Row>


        <AddWithImage isOpen={modalOpen} onClose={() => setModal(false)} isUpdate={false}/>


        <Row>
            <Col span="4"/>
            <Col span="16">
                <ListTable/>
            </Col>
            <Col span="4"/>
        </Row>
    </div>;
}