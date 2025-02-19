import { Alert } from "antd";
import { useState } from "react";

const useFeedback = () => {
    const [feedback, setFeedback] = useState({ msg: null, type: "error" });
    const FeedackHolder = () => {
        return (feedback && feedback.msg) ? (
            <Alert
                message={feedback.msg}
                type={feedback.type}
                showIcon
                className="m-3"
            />
        ) : null;
    }

    return [FeedackHolder, setFeedback];
}

export default useFeedback;