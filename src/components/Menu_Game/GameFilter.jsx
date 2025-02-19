import { useState } from "react";
import { Button, Select, Space, Input, Checkbox } from "antd";
import Constants from "../../modules/constants";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";
import PropTypes from "prop-types";

const { GameStatus } = Constants;

const { Search } = Input;



export default function GameFilter({ onFilterUpdated }) {
  const [keyword, setKeyword] = useState("");
  const [genre, setGenre] = useState([]);
  const [status, setStatus] = useState(undefined);
  const [flags, setFlags] = useState([])

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
      flag: flags
    };
    if (onFilterUpdated)
      onFilterUpdated(filter)
  };

  // const onResetFilter = () => {
  //   setKeyword("");
  //   setGenre([]);
  //   setStatus(undefined);
  // };

  return (
    <div className="mb-3 flex flex-row items-center gap-2">
      <Search
        placeholder="Search by keyword"
        value={keyword}
        onChange={onChangeKeyword}
        className="w-[400px] block"
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
        className="min-w-32"
        placeholder="Select status"
        value={status}
        onChange={onStausChange}
        options={Object.entries(GameStatus).map(([key, value]) => ({
          label: key,
          value,
        }))}
      />
      <div className="flex flex-col items-center bg-gray-100 rounded-md p-2">
        <span className="font-bold">Game Flags</span>
        <Checkbox.Group
          onChange={(values) => {
            const f = [];
            for (const v in values) {
              switch (values[v]) {
                case "new":
                  f.push(1);
                  break;
                case "popular":
                  f.push(2);
                  break;
                case "suggest":
                  f.push(3);
                  break;
                case "promote":
                  f.push(4);
                  break;
              }
            }
            setFlags(f);
          }}
          options={[
            { label: "New", value: "new" },
            { label: "Popular", value: "popular" },
            { label: "Suggest", value: "suggest" },
            { label: "Promote", value: "promote" },
          ]}>
        </Checkbox.Group>
      </div>
      <Space>
        <Button color="primary" variant="link" onClick={onApplyFilter}>
          Apply Filter
        </Button>
        {/* <Button color="default" variant="link" onClick={onResetFilter}>
          Clear Filter
        </Button> */}
      </Space>
    </div>
  );
}

GameFilter.propTypes = {
  onFilterUpdated: PropTypes.func.isRequired,
};