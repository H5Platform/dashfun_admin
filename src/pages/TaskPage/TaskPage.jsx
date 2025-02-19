import { useEffect, useState } from "react";
import API, { requestWithAuthHeader } from "../../modules/api";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import TaskEditor from "./TaskEditor";

const TaskPage = ({ game, onUpdated }) => {
    const [selected, setSelected] = useState(0);
    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const getAllTasks = async () => {
        setLoading(true);
        try {
            const res = await requestWithAuthHeader.post(API.taskForGame + game.id);
            const { code, data, msg } = res.data;
            if (data != null) {
                setTaskList(data);
                console.log("task data", data);
            }
        } catch (e) {
            console.log("error", e);
        } finally {
            setLoading(false);
        }
    }

    const onTaskUpdated = (task) => {
        const newTaskList = taskList.map(t => {
            if (t.id === task.id) {
                return task;
            }
            return t;
        });
        setTaskList(newTaskList);
        if (onUpdated) {
            onUpdated(task);
        }
    }

    useEffect(() => {
        getAllTasks();
    }, [game])

    return <div className="w-full h-full flex flex-col">
        <div className="pl-4 w-full">
            <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => setIsOpen(true)}
            >Add Task</Button
            ></div>
        <div className="w-full h-full flex flex-row gap-2 p-2">
            <div id="task list" className="h-full flex flex-col gap-2 bg-gray-200 p-2 pr-0 rounded-lg">
                <div className="h-full max-w-[300px] overflow-y-auto">
                    <div className=" flex flex-col gap-2">
                        {
                            taskList.map((task, index) => {
                                return <div
                                    key={task.id}
                                    className={`cursor-pointer flex flex-row gap-2 rounded-lg ${selected === index ? 'bg-white rounded-r-none' : ''}`}
                                    onClick={() => setSelected(index)}
                                >
                                    <div className="p-2 pr-4">{task.name}</div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
            <div id="task detail" className="flex-1">
                {taskList.length === 0 ?
                    <div className="flex justify-center items-center h-full">No Task</div> :
                    <TaskEditor task={taskList[selected]} onUpdated={onTaskUpdated} />}
            </div>
        </div>

        <Modal
            title={`Create Task For [${game.name}]`}
            open={isOpen}
            onCancel={() => { setIsOpen(false) }}
            centered
            footer={null}
        >
            <TaskEditor gameId={game.id} task={null} onUpdated={(task) => {
                setIsOpen(false);
                setTaskList([task, ...taskList]);
            }} />
        </Modal>
    </div>
}

export default TaskPage;