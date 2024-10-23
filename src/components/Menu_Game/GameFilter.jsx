import { useState } from "react";
import { Button, Select, Space, Input } from "antd";
import Constants from "../../modules/constants";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";

const { GameStatus } = Constants;

const { Search } = Input;

export default function GameFilter() {
  const [keyword, setKeyword] = useState("");
  const [genre, setGenre] = useState([]);
  const [status, setStatus] = useState(undefined);

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const onStausChange = (value) => {
    setStatus(value);
  };

  const onApplyFilter = () => {
    const filter = {
      keyword,
      genre,
      status,
    };
    JSEvent.emit(Events.GameTable_Update, filter);
  };

  const onResetFilter = () => {
    setKeyword("");
    setGenre([]);
    setStatus(undefined);
  };

  return (
    <div className="mb-3">
      <Search
        placeholder="Search by keyword"
        value={keyword}
        onChange={onChangeKeyword}
        className="my-3"
      />
      {/* <Select
        mode="multiple"
        placeholder="Select genre"
        value={genre}
        onChange={(value) => setGenre(value)}
        className="mb-3"
      >
        <Select.Option value="Action">Action</Select.Option>
        <Select.Option value="Adventure">Adventure</Select.Option>
        <Select.Option value="RPG">RPG</Select.Option>
        <Select.Option value="Strategy">Strategy</Select.Option>
      </Select> */}
      <Select
        placeholder="Select status"
        value={status}
        onChange={onStausChange}
        className="mb-3"
        options={Object.entries(GameStatus).map(([key, value]) => ({
          label: key,
          value,
        }))}
      />
      <Space>
        <Button color="primary" variant="link" onClick={onApplyFilter}>
          Apply Filter
        </Button>
        <Button color="default" variant="link" onClick={onResetFilter}>
          Clear Filter
        </Button>
      </Space>
    </div>
  );
}
