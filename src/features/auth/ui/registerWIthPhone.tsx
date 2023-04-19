import {Button, Card, Col, Form, Input, Row, Typography} from "antd";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {activate, signup} from "../auth.reducer";

import {useEffect, useState} from "react";
import validator from "validator";

import {LOG_g, Status} from "../../../utils/utils";



import {ComponentRegister} from "./component.Register";
import { ComponentConfirm } from "./component.confirm";
import {AuthModel} from "../auth.model";

const {Title, Text} = Typography;


const RegisterWIthPhone = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const [error, setError] = useState('')


    const [credentials, setCredentials] = useState<AuthModel>({})
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [confirmationResult, setConfirmationResult] = useState<any>()

    let usr: AuthModel = {}

    // TODO calls the signup route
    const handleSubmitInfo = (values) => {

        console.log("values==>", values)
        dispatch(LOG_g("values", values))

        if (validator.isEmpty(values.phone)  || validator.isEmpty(values.firstname) ) {
            setError("All fields are required!");
            setTimeout(() => {
                setError("");
            }, 5000);
            return;
        }


        let user: AuthModel = {
            phone: values.phone,
            firstName: values.firstname,
            lastName: values.lastname,
            password: values.password
        }
        try{
            setCredentials(user)
            usr = user
            console.log("cred1=>>", credentials)
            // TODO Needs Fixing from here
            dispatch(signup(user ))
            setShowConfirmation(true)

        }catch (e){
            setError("error seding info")
            console.log("someError happned", e)
        }



    }

    // TODO calls the activate endpoint
    const handleSubmitCode = async (values) => {
        // console.log("handleSubmit", values)

        let userIdToken


        try {


            dispatch(activate({
                phoneOrEmail: values.code,
                code: credentials.phone
            }, history))
        } catch (e) {
            console.log("tryError=", e)
            setError("code error")
            setTimeout(() => {
                setError("");
            }, 1000);
        }
    };

    // @ts-ignore
    return (
        <>
            {/*<div id="recaptcha-container"/>*/}
            <div id="sign-in-button"/>
            {!showConfirmation ? <ComponentRegister onFinish={handleSubmitInfo} error={error}/> : ""}
            {showConfirmation ? <ComponentConfirm onFinish={handleSubmitCode} error={error}/> : ""}


            {/*</div>*/}
        </>
    );
};

export default RegisterWIthPhone;

// ===================    ========   The RegisterWIthPhone Component -----------

