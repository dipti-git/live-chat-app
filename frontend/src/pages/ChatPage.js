import { Box, Flex } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/Chats/SideDrawer";
import MyChats from "../components/Chats/MyChats";
import Chatbox from "../components/Chats/Chatbox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <Flex direction="column" w="100%" h="100vh">
      {user && <SideDrawer />}
      <Flex flex="1">
        {/* Left column for Chats */}
        <Box
          alignItems="center"
          flex="1"
          bg="#ededed"
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
        </Box>

         {/* Right column for Chatbox */}
        <Box
          alignItems="center"
          flex="3"
          bg="#ffffff"
          overflowY="auto" // Enable vertical scroll
        >
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatPage;
