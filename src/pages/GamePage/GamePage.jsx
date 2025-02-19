import { Fragment, useEffect, useState } from "react"
import CreateGame from "../../components/Menu_Game/CreateGame"
import GameFilter from "../../components/Menu_Game/GameFilter"
import API, { requestWithAuthHeader } from "../../modules/api";
import { Layout, Tabs } from "antd";
import Sider from "antd/es/layout/Sider";
import GameCell from "./GameCell";
import GameEditor from "./GameEditor";
import { Pagination } from 'antd';
import TaskPage from "../TaskPage";
import "./GamePage.css";

const pageSize = 10;

const GamePage = () => {
    const [gameData, setGameData] = useState([]);
    const [filter, setFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        const getGameData = async (filter = {}) => {
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
                    setCurrentPage(data.page);
                    setTotalItems(data.total_pages * pageSize);
                    setSelected(0);
                    console.log("game data", data.page, data.total_pages);
                } else {
                    console.log("error", msg);
                }
            } catch (e) {
                console.log("error", e);
            }

            setLoading(false);
        };
        getGameData(filter);
    }, [currentPage, filter]);

    const onPageChanged = (page) => {
        if (page != currentPage) {
            setCurrentPage(page);
        }
    }

    const gameCells = [];

    for (let index = 0; index < gameData?.length ?? 0; index++) {
        const game = gameData[index];
        gameCells.push(<GameCell selected={index == selected} key={game.id} game={game} onClick={g => {
            const idx = gameData.findIndex(d => d.id == g.id)
            console.log("select game:", g.id, idx)
            setSelected(idx);
        }} />)
    }

    return <div className="flex flex-col gap-2 h-full min-w-[800px]">
        <div><CreateGame /></div>
        <GameFilter onFilterUpdated={filter => {
            console.log("filter", filter);
            setFilter(filter);
        }} />

        {(gameData != null && gameData.length > 0) &&
            <Layout className="h-full flex flex-row">
                <div id="game list" className="h-full overflow-y-auto">
                    <div className="flex gap-2 flex-col py-2 pl-2">
                        {gameCells}
                        <Pagination
                            className="pr-2"
                            size="small" align="end"
                            showQuickJumper
                            defaultCurrent={currentPage} total={totalItems}
                            onChange={onPageChanged}
                        />
                    </div>
                </div>
                <div id="game detail" className="bg-white flex-1 m-2 ml-0 rounded-r-xl">
                    <Tabs defaultActiveKey="1" type="card" className="custom-tabs"
                        tabBarExtraContent={{ "left": <div className="p-2"></div> }}
                        items={
                            [
                                {
                                    key: "GameInfo",
                                    label: "Game Info",
                                    children: <GameEditor game={gameData[selected]} onUpdated={(data) => {
                                        gameData[selected] = data
                                        setGameData([...gameData])
                                    }} />,
                                    className: "h-full"
                                }, {
                                    key: "TaskInfo",
                                    label: "Tasks",
                                    children: <TaskPage game={gameData[selected]} onUpdated={() => {

                                    }} />,
                                    className: "h-full"
                                },
                            ]
                        }>
                    </Tabs>


                </div>
            </Layout>
        }
    </div>
}

export default GamePage