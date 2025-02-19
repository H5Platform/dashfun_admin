import { Image } from "antd";
import { getImageUrl } from "../../modules/api";
import Constants from "../../modules/constants";

const width = 350;
const GameCell = ({ game, selected, onClick }) => {
    return <div className="p-2 flex flex-row items-center gap-2 cursor-pointer shadow-md rounded-l-xl"
        onClick={() => {
            if (onClick) {
                onClick(game)
            }
        }}
        style={{
            marginRight: (selected ? 0 : 10),
            width: (selected ? width + 10 : width),
            backgroundColor: (selected ? "#ffffff" : "#e5e7eb"),
            borderTopRightRadius: (selected ? 0 : 12),
            borderBottomRightRadius: (selected ? 0 : 12),
        }} >
        <div className="w-16 h-16 border-spacing-1 border shadow-md ">
            <Image src={getImageUrl(game.id, game.iconUrl)} preview={false} />
        </div>
        <div className="flex flex-col flex-1 h-12 relative">
            <span className="font-bold text-xl w-[210px] overflow-hidden text-ellipsis whitespace-nowrap">{game.name}</span>
            <span className="w-[210px] text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">{game.desc}</span>
            {
                Constants.GameStatus.Pending == game.status && (
                    <div
                        className="px-[5px] py-[1px] bg-red-400 absolute top-[-16px] right-[-8px] rounded-bl-xl text-white font-semibold"
                        style={{
                            borderTopRightRadius: (selected ? 0 : 12),
                        }}
                    >TEST</div>
                )
            }
            {
                Constants.GameStatus.Online == game.status && (
                    <div
                        className="px-[5px] py-[1px] bg-green-400 absolute top-[-16px] right-[-8px] rounded-bl-xl text-white font-semibold"
                        style={{
                            borderTopRightRadius: (selected ? 0 : 12),
                        }}
                    >ONLINE</div>
                )
            }
        </div>
    </div>
}

export default GameCell;