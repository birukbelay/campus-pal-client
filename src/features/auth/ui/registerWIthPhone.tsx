import {Button, Card, Col, Form, Input, Row, Typography} from "antd";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {signup} from "../auth.reducer";

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
        // if (values.password != values.confirmPassword || validator.isEmpty(values.password) || validator.isEmpty(values.confirmPassword)) {
        //     setError("password and match password dont match");
        //     setTimeout(() => {
        //         setError("");
        //     }, 5000);
        //     return;
        // }


        let user: AuthModel = {
            phone: values.phone,
            firstName: values.firstname,
            lastName: values.lastname,
            password: "123456"
        }
        // useEffect(() => { setCredentials(usr) }, [])
        setCredentials(user)
        usr = user
        console.log("cred1=>>", credentials)


        onSignInSubmit()

    }

    const onSignInSubmit = async () => {
        // e.preventDefault()
        console.log("onSignSubmit==>")

        const phoneNumber =  usr.phone
        // const phoneNumber = "+251" + usr.phone
        console.log("cred=>>", credentials)

        console.log("pp=", phoneNumber)


        try {
            setShowConfirmation(true)
            console.log("OTP has been sent")
        } catch (e) {
             console.log("err", e)
            // Error; SMS not sent
            setError("error verifying your phone")
            setShowConfirmation(false)
            // ...
            console.log("someError happned")
        }


    }

    const handleSubmitCode = async (values) => {
        // console.log("handleSubmit", values)

        let userIdToken


        try {
            // const auth = result.getIdToken()

            const res = await confirmationResult.confirm(values.code)
            console.log("result=>", JSON.stringify(res))
            // console.log("resultIdTOken=", JSON.stringify(auth))
            userIdToken = await res.user.getIdToken()
            // console.log("userIdToken=", JSON.stringify(userIdToken))
            console.log("userIdToken=", userIdToken)

            alert("User is verified")
            const data = {
                firstname: credentials.firstName,
                lastname: credentials.lastName,
                phone: credentials.phone,
                // email: credentials.email,
                password: credentials.password,
                idToken: userIdToken
            }
            // dispatch(LOG_g("handleSubmit", data))
            // console.log("data=0/", data)
            // console.log("cer==>", credentials)


            dispatch(signup(data, history))
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

