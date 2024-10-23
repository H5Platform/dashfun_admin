import {
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import Constants from "../../modules/constants";
import { useEffect, useState } from "react";
import API, { requestWithAuthHeader } from "../../modules/api";
import DataCenter from "../../modules/DataCenter";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";
import AuthChangeModal from "./AuthChangeModal";
import StatusChangeModal from "./StatusChangeModal";

const { UserStatus, Authority } = Constants;

const pageSize = 10;

const hasAuth = (auth) => {
  const auths = [];
  if (auth & Authority.UserManagement)
    auths.push(
      <Tag color="green" key="um">
        User Management
      </Tag>
    );
  if (auth & Authority.GameManagement)
    auths.push(
      <Tag color="blue" key={"gm"}>
        Game Management
      </Tag>
    );
  if (auth & Authority.TaskManagement)
    auths.push(
      <Tag color="purple" key={"tm"}>
        Task Management
      </Tag>
    );
  return auths;
};

export default function AccountTable() {
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [resetPwdLoading, setResetPwdLoading] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      console.log("isloggedin", DataCenter.isLoggedIn);
      if (!DataCenter.isLoggedIn) return;
      setLoading(true);
      try {
        const res = await requestWithAuthHeader.post(API.userSearch, {
          page: currentPage,
          size: pageSize,
          name: "",
          email: "",
          status: 0,
        });

        const { code, data, msg } = res.data;
        console.log("ressss", code, data, msg);
        if (code == 0) {
          setData(data.data);
        } else {
          console.log("error", msg);
        }
        setLoading(false);
      } catch (e) {
        console.log("error", e);
      }
    };

    getUserData();

    JSEvent.on(Events.Account.Login, getUserData);
    JSEvent.on(Events.AccountTable_Update, getUserData);

    return () => {
      JSEvent.remove(Events.Account.Login, getUserData);
      JSEvent.remove(Events.AccountTable_Update, getUserData);
    };
  }, [currentPage]);

  const resetPasswordHandler = async (user_id) => {
    setResetPwdLoading(true);
    try {
      const res = await requestWithAuthHeader.post(API.resetPassword, {
        user_id,
      });
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code == 0) {
        console.log("success");
        JSEvent.emit(Events.GameTable_Update);
      } else {
        console.log("error", msg);
      }
    } catch (e) {
      console.log("error", e);
    }
    setResetPwdLoading(false);
  };

  const updateUserStatusHandler = async (user_id, status) => {
    try {
      const res = await requestWithAuthHeader.post(API.updateUserStatus, {
        user_id,
        status,
      });
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code == 0) {
        console.log("success");
      } else {
        console.log("error", msg);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      editable: true, // Mark this column as editable
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      editable: true, // Mark this column as editable
    },
    {
      title: "Authorization",
      dataIndex: "authorization",
      key: "authorization",
      editable: true, // Mark this column as editable
      render: (auth) => {
        // console.log(auth);
        auth === -1 && <></>;
        return <>{hasAuth(auth)}</>;
      },
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case UserStatus.Normal:
            return <Tag color="green">Normal</Tag>;
          case UserStatus.ResetPassword:
            return <Tag color="yellow">Reset Password</Tag>;
          default:
            return <Tag color="red">Ban</Tag>;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.id == DataCenter.userInfo.userId) return <></>;

        let btns = [];

        switch (record.status) {
          case UserStatus.Normal:
            // onClick = {() => resetAccountPassword(record)}
            btns.push(<AuthChangeModal record={record} />);
            btns.push(<StatusChangeModal record={record} />);
            btns.push(
              <Popconfirm
                key={3}
                title={
                  <div>
                    Are you sure to reset password for user
                    <span className="font-semibold"> {record.name}</span>?
                    <br />
                    user will not be able to login until the account has been
                    reactivated.
                  </div>
                }
                okText="Yes"
                cancelText="cancel"
                onConfirm={() => resetPasswordHandler(record.id)}
              >
                <Button loading={resetPwdLoading}>Reset Password</Button>
              </Popconfirm>
            );
            break;
          /*
            btns.push(
              <Button
                key={2}
                danger
                loading={btnDisableLoading[record.id]}
                onClick={() => disableAccount(record)}
              >
                Disable
              </Button>
            );
            break;
          case UserStatus.ResetPassword:
            btns.push(
              <Button
                key={1}
                danger
                loading={btnDisableLoading[record.id]}
                onClick={() => disableAccount(record)}
              >
                Disable
              </Button>
            );
            break;
          case UserStatus.Ban:
            btns.push(
              <Button
                key={1}
                loading={btnEnableLoading[record.id]}
                onClick={() => enableAccount(record)}
              >
                Enable
              </Button>
            );
            break;
            */
          default:
            break;
        }

        return (
          <Space size="middle">
            <Button.Group>{btns}</Button.Group>
          </Space>
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        loading={loading}
        form={form}
        columns={columns}
        // components={{
        //   body: {
        //     cell: EditableCell,
        //   },
        // }}
        dataSource={data} // Use the dummy data directly
        rowKey="id" // Use `id` as the row key
        pagination={{
          pageSize: 10,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />
    </Form>
  );
}
