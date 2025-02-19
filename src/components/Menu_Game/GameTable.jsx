import {
  Image,
  Space,
  Table,
  Form,
  Input,
  Popconfirm,
  Typography,
  Tag,
  Select,
} from "antd";
import CreateGame from "./CreateGame";
import { useEffect, useState } from "react";
import API, { getImageUrl, requestWithAuthHeader } from "../../modules/api";
import ImageUploadModal from "./ImageUploadModal";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";
import GameFilter from "./GameFilter";
import Constants from "../../modules/constants";

const GameStatus = Constants.GameStatus;

const pageSize = 10;

export default function GameTable() {
  const [form] = Form.useForm();
  const [gameData, setGameData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");

  const [editingData, setEditingData] = useState({});

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      description: "",
      status: "",
      genre: "",
      url: "",
      // iconUrl: "",
      // mainImageUrl: "",
      // logoUrl: "",
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  useEffect(() => {
    const getGameData = async (filter = {}) => {
      console.log("filter", filter);
      setLoading(true);
      try {
        const res = await requestWithAuthHeader.post(API.gameSearch, {
          ...filter,
          page: currentPage,
          size: pageSize,
        });

        const { code, data, msg } = res.data;
        if (code === 0) {
          setGameData(data.data);
          console.log("game data", data);
        } else {
          console.log("error", msg);
        }
      } catch (e) {
        console.log("error", e);
      }

      setLoading(false);
    };

    getGameData();

    JSEvent.on(Events.GameTable_Update, getGameData);
    return () => {
      JSEvent.remove(Events.GameTable_Update, getGameData);
    };
  }, [currentPage]);

  const onEditing = (val, dataIndex) => {
    setEditingData((pre) => ({ ...pre, [dataIndex]: val }));
    console.log("e", val, dataIndex);
  };

  const onSave = async (id) => {
    // form.validateFields();
    const updatedData = { id, ...editingData };
    try {
      const res = await requestWithAuthHeader.post(API.gameUpdate, updatedData);
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code === 0) {
        JSEvent.emit(Events.GameTable_Update);
        setEditingKey("");
        setEditingData({});
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    // console.log("record", record);
    let inputNode = <Input />;
    if (["name", "desc", "genre", "url"].includes(dataIndex)) {
      inputNode = (
        <Input onBlur={(e) => { onEditing(e.target.value, dataIndex) }} /*onChange={(e) => onEditing(e.target.value, dataIndex)}*/ />
      );
    }

    //Handle image fields (iconUrl, mainImageUrl, logoUrl) with the Upload component
    // if (["iconUrl", "mainImageUrl", "logoUrl"].includes(dataIndex)) {
    //   inputNode = (
    //     <Upload
    //       maxCount={1}
    //       listType="picture-card"
    //       showUploadList={true} // Show the selected image file in the Upload component
    //       beforeUpload={() => false} // Prevent automatic upload
    //       onChange={(info) => handleFileChange(info, dataIndex)} // Handle file change
    //     >
    //       Upload
    //     </Upload>
    //   );
    // }

    if (dataIndex == "status") {
      inputNode = (
        <Select
          defaultValue={record.status}
          onChange={(value) => onEditing(value, dataIndex)}
        >
          <Select.Option value={GameStatus.Online}>Online</Select.Option>
          <Select.Option value={GameStatus.Removed}>Removed</Select.Option>
          <Select.Option value={GameStatus.Pending}>Pending</Select.Option>
          <Select.Option value={GameStatus.Normal}>Normal</Select.Option>
        </Select>
      );
    }

    // if(dataIndex == "genre"){
    //     inputNode = (
    //         <Select
    //           defaultValue={record.genre}
    //           onChange={(value) => onEditing(value, dataIndex)}
    //           mode="multiple"
    //         >
    //           <Select.Option value={GameStatus.Online}>Online</Select.Option>
    //           <Select.Option value={GameStatus.Removed}>Removed</Select.Option>
    //           <Select.Option value={GameStatus.Pending}>Pending</Select.Option>
    //           <Select.Option value={GameStatus.Normal}>Normal</Select.Option>
    //         </Select>
    //       );
    // }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      editable: false,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Description",
      dataIndex: "desc",
      width: "30%",
      key: "desc",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        const status = record.status;
        console.log("status", status, editable);
        if (editable) {
          return (
            <Select
              defaultValue={status}
              onChange={(value) => {
                console.log("onchange", value)
                const newData = [...gameData];
                const index = newData.findIndex(
                  (item) => record.id === item.id
                );
                if (index > -1) {
                  const item = newData[index];
                  newData.splice(index, 1, { ...item, status: value });
                  setGameData(newData);
                }
              }}
            >
              <Select.Option value={GameStatus.Online}>Online</Select.Option>
              <Select.Option value={GameStatus.Removed}>Removed</Select.Option>
              <Select.Option value={GameStatus.Pending}>Testing</Select.Option>
              <Select.Option value={GameStatus.Normal}>Normal</Select.Option>
            </Select>
          );
        } else {
          if (status === GameStatus.Online) {
            return <Tag color="green">Online</Tag>;
          } else if (status === GameStatus.Removed) {
            return <Tag color="red">Removed</Tag>;
          } else if (status === GameStatus.Pending) {
            return <Tag color="blue">Testing</Tag>;
          } 
        }
      },
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      editable: false,
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      editable: true,
    },
    {
      title: "Icon URL",
      dataIndex: "iconUrl",
      key: "iconUrl",
      editable: false,
      render: (_, { id, iconUrl }) =>
        iconUrl == "" ? null : (
          <Image src={getImageUrl(id, iconUrl)} style={{ width: "100px" }} />
        ), // Render preview if not in edit mode
    },
    {
      title: "Logo URL",
      dataIndex: "logoUrl",
      key: "logoUrl",
      editable: false,
      render: (_, { id, logoUrl }) =>
        logoUrl == "" ? null : (
          <Image src={getImageUrl(id, logoUrl)} style={{ width: "100px" }} />
        ), // Render preview if not in edit mode
    },
    {
      title: "Main Image URL",
      dataIndex: "mainImageUrl",
      key: "mainImageUrl",
      editable: false,
      render: (_, { id, mainPicUrl }) =>
        mainPicUrl == "" ? null : (
          <Image src={getImageUrl(id, mainPicUrl)} style={{ width: "100px" }} />
        ), // Render preview if not in edit mode
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => onSave(record.id)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)} // Edit the row
            >
              Edit
            </Typography.Link>
            <ImageUploadModal data={record} disabled={editingKey != ""} />
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "status" ? "number" : "text", // Define input types for status as number
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <CreateGame />
      <GameFilter />
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        loading={loading}
        dataSource={gameData}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          pageSize: 10,
          onChange: (page) => {
            setCurrentPage(page);
            cancel();
          },
        }}
        rowKey="id" // Use the id field as a unique key for each row
      />
    </Form>
  );
}
