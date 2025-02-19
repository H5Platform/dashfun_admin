import { Alert, Button, Checkbox, Divider, Form, Input, notification, Select, Space } from "antd";
import { useEffect, useState } from "react";
import Constants from "../../modules/constants";
import API, { requestWithAuthHeader } from "../../modules/api";
import useFeedback from "../../components/Feedback/Feedback";

const { TaskTypes, TaskConditions, TaskCategory, TaskRewardTypes } = Constants;
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


const conditionSetting = {
    [TaskConditions.PlayRandomGame]: {
        tip: "Play any game counting once",
        count: {
            show: true, value: 1, label: "Play Times",
            validator: (rule, value) => {
                console.log("value", value, typeof value);
                const v = Number(value);
                if (!Number.isInteger(v) || v < 1) {
                    return Promise.reject("'Play Times' must be an integer greater than 1");
                }
                return Promise.resolve();
            }
        },
        link: {
            show: false, value: "",
        },
        condition: {
            show: false, value: "",
        },
    },
    [TaskConditions.PlayGame]: {
        tip: "Play this game counting once",
        count: {
            show: true, value: 1, label: "Play Times",
            validator: (rule, value) => {
                const v = Number(value);
                if (!Number.isInteger(v) || v < 1) {
                    return Promise.reject("'Play Times' must be an integer greater than 1");
                }
                return Promise.resolve();
            },
        },
        link: {
            show: false, value: "",
        },
        condition: {
            show: false, value: "",
        },
    },
    [TaskConditions.LevelUp]: {
        tip: "Reach target level in this game",
        count: {
            show: false, value: 1,
        },
        link: {
            show: false, value: "",
        },
        condition: {
            show: true, value: 1, label: "Target Level",
            validator: (rule, value) => {
                const v = Number(value);
                if (!Number.isInteger(v) || v < 1) {
                    return Promise.reject("'Target Level' must be an integer greater than 1");
                }
                return Promise.resolve();
            },
        },
    },
    [TaskConditions.JoinTGChannel]: {
        tip: "",
        count: {
            show: false, value: 1,
        },
        link: {
            show: true, value: "", label: "TG Channel Link", type: "url",
            validator: (rule, value) => {
                if (!value.startsWith("https://t.me/")) {
                    return Promise.reject("'TG Channel Link' must be a valid telegram channel link");
                }
                return Promise.resolve();
            },
        },
        condition: {
            show: true, value: "", label: "TG Channel Id", type: "string",
        },
    },
    [TaskConditions.FollowX]: {
        tip: "",
        count: {
            show: false, value: 1
        },
        link: {
            show: true, value: "", label: "X Link",
            validator: (rule, value) => {
                if (!value.startsWith("https://")) {
                    return Promise.reject("'X Link' must be a valid X url");
                }
                return Promise.resolve();
            },
        },
        condition: {
            show: false, value: "",
        },
    },
    [TaskConditions.SpendTGStars]: {
        tip: "",
        count: {
            show: true, value: 1, label: "Spend Stars",
            validator: (rule, value) => {
                const v = Number(value);
                if (!Number.isInteger(v) || v < 1) {
                    return Promise.reject("'Spend Stars' must be an integer greater than 1");
                }
                return Promise.resolve();
            },
        },
        link: {
            show: false, value: "",
        },
        condition: {
            show: false, value: "",
        },
    },
    [TaskConditions.BindWallet]: {
        tip: "",
        count: {
            show: false, value: 1
        },
        link: {
            show: false, value: "",
        },
        condition: {
            show: false, value: "",
        },
    },
    [TaskConditions.InviteFriends]: {
        tip: "",
        count: {
            show: true, value: 1, label: "Invite Count",
            validator: (rule, value) => {
                const v = Number(value);
                if (!Number.isInteger(v) || v < 1) {
                    return Promise.reject("'Invite Count' must be an integer greater than 1");
                }
                return Promise.resolve();
            },
        },
        link: {
            show: false, value: "",
        },
        condition: {
            show: false, value: "",
        },
    },

}

const TaskEditor = ({ gameId, task, onUpdated }) => {
    const [form] = Form.useForm();
    const [conditionType, setConditionType] = useState(task?.require.type);
    const [FeedackHolder, setFeedback] = useFeedback();
    const openNotification = (title, msg) => {
        setFeedback({ type: "error", msg: msg });
    };

    useEffect(() => {
        form.resetFields();
        setConditionType(task?.require.type);
        setFeedback(null);
    }, [task])


    const saveTask = async (values) => {
        setFeedback(null);
        const t = {
            ...values,
            game_id: gameId,
            require: {
                type: values.conditionType,
                condition: values.conditionStr,
                count: Number(values.conditionCount),
                link: values.conditionLink,
            },
            reward: []
        }

        if (values.dashfun_xp > 0) {
            t.reward.push({ reward_type: TaskRewardTypes.DashFunXP, amount: Number(values.dashfun_xp) });
        }
        if (values.game_point > 0) {
            t.reward.push({ reward_type: TaskRewardTypes.GamePoint, amount: Number(values.game_point) });
        }
        try {
            const res = await requestWithAuthHeader.post(task == null ? API.taskCreate : API.taskUpdate, t);
            const { code, data, msg } = res.data;
            if (code === 0) {
                if (onUpdated)
                    onUpdated(data);
            } else {
                openNotification("Error", msg);
            }
        } catch (e) {
            openNotification("Error", e.response.data.msg);
        }
    }


    const onFinish = (values) => {
        saveTask(values);
    }

    const onReset = () => {
        setConditionType(task?.require.type);
        setFeedback(null);
    }

    const rewards = {};
    task?.rewards?.forEach(r => {
        rewards[r.reward_type] = r.amount;
    });

    return <div>
        <Form
            validateMessages={{
                required: '${label} is required!',
                types: {
                    email: '${label} is not a valid email!',
                    number: '${label} is not a valid number!',
                    url: '${label} is not a valid url!',
                    integer: '${label} is not a valid integer!',
                },
                number: {
                    range: '${label} must be between ${min} and ${max}',
                },
                integer: {
                    range: '${label} must be an integer between ${min} and ${max}',
                },
            }}
            form={form}
            name={task?.name}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
            initialValues={{
                ...task,
                conditionType: task?.require.type,
                conditionStr: task?.require.condition,
                conditionCount: task?.require.count,
                conditionLink: task?.require.link,
                dashfun_xp: rewards[TaskRewardTypes.DashFunXP] ?? 0,
                game_point: rewards[TaskRewardTypes.GamePoint] ?? 0,
            }}
            onFinish={onFinish}
            onReset={onReset}
        >

            <Divider >Information</Divider>
            {(task != null && <Form.Item label="Id" name="id" >
                <Input readOnly />
            </Form.Item>)}
            <Form.Item label="Name" name="name" rules={[{ required: true }]} >
                <Input />
            </Form.Item>
            <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                <Select
                    className="min-w-32"
                    placeholder="Select Type"
                    options={Object.entries(TaskCategory).map(([key, value]) => ({
                        label: key,
                        value,
                    }))}
                />
            </Form.Item>
            {(task != null && <Form.Item label="Open" name="open" valuePropName="checked"  >
                <Checkbox />
            </Form.Item>)}
            <Form.Item label="Type" name="task_type" rules={[{ required: true }]}>
                <Select
                    className="min-w-32"
                    placeholder="Select Type"
                    options={Object.entries(TaskTypes).map(([key, value]) => ({
                        label: key,
                        value,
                    }))}
                />
            </Form.Item>
            <Divider >Condition</Divider>
            <Form.Item label="Condition" name="conditionType" rules={[{ required: true }]}
                extra={conditionSetting[conditionType]?.tip}>
                {/* <ConditionEditor /> */}
                <Select
                    onChange={(v) => {
                        setConditionType(v);
                        const setting = conditionSetting[v];
                        form.setFieldValue("conditionStr", setting.condition.value);
                        form.setFieldValue("conditionCount", setting.count.value);
                        form.setFieldValue("conditionLink", setting.link.value);
                    }}
                    className="min-w-32"
                    placeholder="Select Type"
                    options={Object.entries(TaskConditions).map(([key, value]) => ({
                        label: key,
                        value,
                    }))}
                />
            </Form.Item>
            {
                conditionSetting[conditionType]?.condition.show &&
                <Form.Item
                    label={conditionSetting[conditionType].condition.label}
                    name="conditionStr"
                    rules={[{
                        required: true,
                        validator: conditionSetting[conditionType].condition.validator
                    }]}
                    extra={conditionSetting[conditionType].condition.tip}
                >
                    <Input />
                </Form.Item>
            }
            {
                conditionSetting[conditionType]?.count.show &&
                <Form.Item
                    label={conditionSetting[conditionType].count.label}
                    name="conditionCount"
                    rules={[{
                        required: true,
                        validator: conditionSetting[conditionType].count.validator
                    }]}
                    extra={conditionSetting[conditionType].count.tip}>
                    <Input />
                </Form.Item>
            }
            {
                conditionSetting[conditionType]?.link.show &&
                <Form.Item
                    label={conditionSetting[conditionType].link.label}
                    name="conditionLink"
                    rules={[{
                        required: true,
                        validator: conditionSetting[conditionType].link.validator
                    }]}
                    extra={conditionSetting[conditionType].link.tip}>
                    <Input />
                </Form.Item>
            }

            <Divider >Rewards</Divider>
            <Form.Item label="DashFun XP" name="dashfun_xp" rules={[{ required: true }]}>
                <Input type={"number"} />
            </Form.Item>
            <Form.Item label="Game Point" name="game_point" rules={[{ required: true }]}>
                <Input type={"number"} />
            </Form.Item>

            <FeedackHolder />

            <Form.Item label={null} {...tailLayout}>
                <Space>
                    <Button type="primary" htmlType="submit" >
                        {task == null ? "Create" : "Update"}
                    </Button>

                    <Button htmlType="reset">
                        Reset
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    </div >
}

export default TaskEditor;