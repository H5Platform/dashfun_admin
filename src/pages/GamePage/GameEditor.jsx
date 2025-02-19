import { Alert, Button, Checkbox, Divider, Form, Image, Input, notification, Select, Space, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import Constants from "../../modules/constants";
import { PlayCircleFilled, UploadOutlined } from "@ant-design/icons";
import API, { getImageUrl, requestWithAuthHeader } from "../../modules/api";
import useFeedback from "../../components/Feedback/Feedback";
import { use } from "react";
import { useForm } from "antd/es/form/Form";

const GameStatus = Constants.GameStatus;
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const FlagMap = {
    "new": 1,
    "popular": 2,
    "suggest": 3,
    "promote": 4
}

const GameEditor = ({ game, onUpdated }) => {
    const [form] = Form.useForm();
    const [formPics] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [modified, setModified] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [apiSecret, setApiSecret] = useState("");
    const [feedback, setFeedback] = useState(null);

    const openNotification = (title, msg) => {
        setFeedback({ type: "error", msg: msg });
    };

    const loadApiSecret = async () => {
        try {
            const res = await requestWithAuthHeader.post(API.gameApiSecret(game.id));
            const { code, data, msg } = res.data;
            if (code == 0) {
                setApiSecret(data);
                form.setFieldValue("api_secret", data);
            } else {
                openNotification("error", msg);
                setApiSecret("");
            }
        } catch (e) {
            openNotification("error", e.response.data.msg);
            setApiSecret("");
        }
    }


    useEffect(() => {
        form.resetFields();
        formPics.resetFields();
        loadApiSecret();
        setFeedback(null);
        setModified(false);
        setUploaded(false);
    }, [game])

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const onFinish = async (values) => {
        setSaving(true);
        const updatedData = { ...values, openTime: -1 };
        const flags = [];

        for (let index = 0; index < updatedData.flags.length; index++) {
            const flag = updatedData.flags[index];
            const v = FlagMap[flag];
            if (v) {
                flags.push(v);
            }
        }
        updatedData.flags = flags;

        try {
            const res = await requestWithAuthHeader.post(API.gameUpdate, updatedData);
            const { code, data, msg } = res.data;
            console.log("res", code, data, msg);

            if (onUpdated) {
                onUpdated(data)
            }
            setModified(false);
        } catch (e) {
            console.log("error", e.response.data.msg);
            openNotification("save error", e.response.data.msg);
        } finally {
            setSaving(false);
        }
    }

    const onUpdateImages = async (values) => {
        // setOpen(true);
        setUploading(true);

        const formData = new FormData();
        formData.append("game_id", game.id);


        for (const key in values) {
            const file = values[key];
            if (file != null) {
                formData.append(key, file.file)
            }
        }

        // for (const key in fileList) {
        //     if (fileList[key]) {
        //         formData.append(key, fileList[key]);
        //     }
        // }
        console.log("formData", formData);
        if (formData.length > 0) {
            try {
                const res = await requestWithAuthHeader.post(API.updateImage, formData);
                const { code, data, msg } = res.data;
                if (onUpdated && data) {
                    onUpdated(data);
                }
                console.log("res", res);
            } catch (e) {
                console.log("error", e);
            } finally {
                setUploading(false);
            }
        } else {
            setUploading(false);
        }
    };

    if (game == null) {
        return null;
    } else {
        const iconImage = game.iconUrl
            ? {
                uid: 1,
                name: "icon.png",
                url: getImageUrl(game.id, game.iconUrl),
                status: 'done'
            }
            : null;

        const logoImage = game.logoUrl
            ? {
                uid: 2,
                name: "logo.png",
                url: getImageUrl(game.id, game.logoUrl),
            }
            : null;

        const mainImage = game.mainPicUrl
            ? {
                uid: 3,
                name: "main.png",
                url: getImageUrl(game.id, game.mainPicUrl),
            }
            : null;

        return <div className="h-full w-full overflow-y-auto">
            <div className="w-full p-2 flex  gap-2 max-2xl:flex-col 2xl:flex-row">
                <div className="flex-1">
                    <Divider>{modified ? "*" : ""}Information{modified ? "(Changed)*" : ""}</Divider>
                    <Form
                        onFieldsChange={(changedFields, allFields) => {
                            setModified(true);
                        }}
                        onReset={() => { setModified(false); }}
                        onFinish={onFinish}
                        form={form}
                        name={game?.name}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        autoComplete="off"
                        initialValues={{
                            ...game
                            ,
                            flags: [
                                game.new == 1 ? "new" : "",
                                game.popular == 1 ? "popular" : "",
                                game.suggest == 1 ? "suggest" : "",
                                game.banner == 1 ? "promote" : ""]
                        }}
                    >

                        <Form.Item
                            label="Id"
                            name="id"
                        >
                            <Input readOnly />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input game name"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="desc"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input game description"
                                }
                            ]}
                        >
                            <TextArea />
                        </Form.Item>
                        <Form.Item
                            label="Status"
                            name="status"
                        >
                            <Select>
                                <Select.Option value={GameStatus.Online}>Online</Select.Option>
                                <Select.Option value={GameStatus.Removed}>Removed</Select.Option>
                                <Select.Option value={GameStatus.Pending}>Testing</Select.Option>
                                <Select.Option value={GameStatus.All}>No Status</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Game URL"
                            name="url"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input game url"
                                }
                            ]}
                        >
                            <Input
                            // suffix={<Button type="primary"
                            //     onClick={() => {

                            //     }}
                            // ><PlayCircleFilled /></Button>} 
                            />
                        </Form.Item>
                        <Form.Item
                            label="Flags"
                            name="flags"
                            extra={<div className="flex flex-col">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td align="right" className="pr-2 font-semibold">New</td>
                                            <td>Show game at the top of New Game List</td>
                                        </tr>
                                        <tr>
                                            <td align="right" className="pr-2 font-semibold">Popular</td>
                                            <td>Show game at the top of Popular Game List</td>
                                        </tr>
                                        <tr>
                                            <td align="right" className="pr-2 font-semibold">Suggest</td>
                                            <td>Show game at the top of Suggest Game List</td>
                                        </tr>
                                        <tr>
                                            <td align="right" className="pr-2 font-semibold">Promote</td>
                                            <td>Show game at the top GameCenter Main Page</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            }
                        >
                            <Checkbox.Group options={[
                                { label: "New", value: "new" },
                                { label: "Popular", value: "popular" },
                                { label: "Suggest", value: "suggest" },
                                { label: "Promote", value: "promote" },
                            ]
                            } />
                        </Form.Item>

                        <Form.Item
                            label="Api Secret"
                            name="api_secret"
                        >
                            <Input.Password readOnly value={apiSecret} />
                        </Form.Item>
                        {feedback && (
                            <Alert
                                message={feedback.msg}
                                type={feedback.type}
                                showIcon
                                className="mb-3"
                            />
                        )}
                        <Form.Item label={null} {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit" loading={saving}>
                                    {modified ? "*" : ""}Save{modified ? "*" : ""}
                                </Button>

                                <Button htmlType="reset">
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>

                <div className="flex-1">
                    <Divider>{uploaded ? "*" : ""}Images{uploaded ? "(Changed)*" : ""}</Divider>
                    <Form
                        disabled={uploading}
                        form={formPics}
                        name={game.name + "-picts "}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onUpdateImages}
                        onChange={(info) => { setUploaded(true); }}
                        onReset={() => { setUploaded(false); }}
                    >
                        <Form.Item name="icon" label="Icon Image">
                            <Upload
                                maxCount={1}
                                listType="picture-card"
                                onPreview={handlePreview}
                                // onChange={(info) => onChange(info, "icon")}
                                defaultFileList={iconImage ? [iconImage] : []}
                                beforeUpload={() => false}
                            >
                                <UploadOutlined /> Upload
                            </Upload>
                        </Form.Item>

                        <Form.Item name="logo" label="Logo Image">
                            <Upload
                                maxCount={1}
                                listType="picture-card"
                                onPreview={handlePreview}
                                // onChange={(info) => onChange(info, "icon")}
                                defaultFileList={logoImage ? [logoImage] : []}
                                beforeUpload={() => false}
                            >
                                <UploadOutlined /> Upload
                            </Upload>
                        </Form.Item>

                        <Form.Item name="main" label="mainPic">
                            <Upload
                                maxCount={1}
                                listType="picture-card"
                                onPreview={handlePreview}
                                // onChange={(info) => onChange(info, "icon")}
                                defaultFileList={mainImage ? [mainImage] : []}
                                beforeUpload={() => false}
                            >
                                <UploadOutlined /> Upload
                            </Upload>
                        </Form.Item>
                        <Form.Item label={null} {...tailLayout}>
                            <Space>
                                <Button type="primary" htmlType="submit" loading={uploading}>
                                    {uploaded ? "*" : ""} Upload{uploaded ? "*" : ""}
                                </Button>

                                <Button htmlType="reset">
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
                <div className="flex-1">
                    <CoinEditor gameId={game?.id} />
                </div>
                {previewImage && (
                    <Image
                        wrapperStyle={{
                            display: "none",
                        }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                    />
                )}
            </div>
        </div>
    }
}

export default GameEditor;

const CoinEditor = ({ gameId, onUpdated }) => {
    const [coin, setCoin] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [modified, setModified] = useState(false);
    const [FeedbackHolder, setFeedback] = useFeedback();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const coinImage = {
        uid: 1,
        name: "coin.png",
        url: getImageUrl(gameId, "coin.png"),
        status: 'done'
    }

    const [form] = Form.useForm();

    const loadCoin = async (gameId) => {
        // load coin data
        try {
            const res = await requestWithAuthHeader.get(API.coinGet(gameId));
            const { code, data, msg } = res.data;
            if (code == 0) {
                setCoin(data);
            } else {
            }
        } catch (e) {

        }
    }

    const onFinish = async (values) => {
        setUploading(true);
        const formData = new FormData();

        formData.append("id", values.id);
        formData.append("name", values.name);
        formData.append("symbol", values.symbol);
        formData.append("desc", values.desc);
        formData.append("can_withdraw", values.can_withdraw);
        formData.append("min_withdraw", values.min_withdraw);
        if (values.icon != null) formData.append("icon", values.icon?.file);

        try {
            const res = await requestWithAuthHeader.postForm(API.coinUpdate(gameId), formData);
            setModified(false);
        } catch (e) {
            setFeedback({ type: "error", msg: e.response.data.msg });
        } finally {
            setUploading(false);
        }
    }

    useEffect(() => {
        // load coin data
        if (gameId != null)
            loadCoin(gameId);
        setModified(false);
    }, [gameId])

    useEffect(() => {
        form.resetFields();
    }, [coin])
    
    return <div>
        <Divider>{modified ? "*" : ""}Coin{modified ? "(Changed)*" : ""}</Divider>
        <Form
            onChange={(changedFields, allFields) => {
                setModified(true);
            }}
            onReset={() => {
                setModified(false);
            }}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
            onFinish={onFinish}
            initialValues={{ ...coin }}
        >
            <Form.Item
                label="Coin Id"
                name="id"
            >
                <Input readOnly />
            </Form.Item>
            <Form.Item
                label="Coin Name"
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Please input Coin Name"
                    }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Coin Symbol"
                name="symbol"
                rules={[
                    {
                        required: true,
                        type: "string",
                        max: 5
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Description"
                name="desc"
                rules={[
                    {
                        required: true,
                        message: "Please input Coin Description"
                    }
                ]}
            >
                <TextArea />
            </Form.Item>

            <Form.Item
                label="Can Withdraw"
                name="can_withdraw"
                valuePropName="checked"
            >
                <Checkbox />
            </Form.Item>
            <Form.Item
                label="Min Withdraw"
                name="min_withdraw"
            >
                <Input type="number" />
            </Form.Item>
            <Form.Item name="icon" label="Coin Icon">
                <Upload
                    maxCount={1}
                    listType="picture-card"
                    onPreview={handlePreview}
                    // onChange={(info) => onChange(info, "icon")}
                    defaultFileList={[coinImage]}
                    beforeUpload={() => false}
                >
                    <UploadOutlined /> Upload
                </Upload>
            </Form.Item>
            <FeedbackHolder />
            <Form.Item label={null} {...tailLayout}>
                <Space>
                    <Button type="primary" htmlType="submit" loading={uploading}>
                        {modified ? "*" : ""} Update{modified ? "*" : ""}
                    </Button>

                    <Button htmlType="reset">
                        Reset
                    </Button>
                </Space>
            </Form.Item>
        </Form>
        {previewImage && (
            <Image
                wrapperStyle={{
                    display: "none",
                }}
                preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
            />
        )}
    </div>
}