import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { Tooltip, Avatar } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((currentMessage, indexOfCurrentMessage) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                user._id === currentMessage.sender._id
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "10px", // Add spacing between messages
            }}
            key={currentMessage._id}
          >
            {(isSameSender(
              messages,
              currentMessage,
              indexOfCurrentMessage,
              user._id
            ) ||
              isLastMessage(messages, indexOfCurrentMessage, user._id)) && (
              <Tooltip
                label={currentMessage.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={currentMessage.sender.name}
                  src={currentMessage.sender.pic}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  currentMessage.sender._id === user._id ? "#B9F5D0" : "#E4E4E4"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  currentMessage,
                  indexOfCurrentMessage,
                  user._id
                ),
                marginTop: isSameUser(
                  messages,
                  currentMessage,
                  indexOfCurrentMessage,
                  user._id
                )
                  ? 3
                  : 10,
                borderRadius: "15px",
                padding: "8px 12px",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {currentMessage.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
