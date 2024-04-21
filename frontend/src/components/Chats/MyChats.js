import { Box, Text, Stack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import LoadingChats from "./LoadingChats";
import { getSenderName } from "../../config/ChatLogics";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    console.log(user._id);
    try {
      const { data } = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      width="500px"
      height="700px"
      p={3}
      bg="white"
      w={{ base: "100%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Chats
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        // h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack spacing={2}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text fontSize="md">
                  {getSenderName(loggedUser, chat.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <LoadingChats />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
