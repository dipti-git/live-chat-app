import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider";
import {
  Flex,
  IconButton,
  Spinner,
  useToast,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderName, getSenderInfo } from "../../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import { useState, useEffect } from "react";
import axios from "axios";
// import './../styles.css';
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SelectedUserChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(data, "fetchmessages data request");
      setMessages(data);
      console.log(messages, "messages");
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      setMessages([...messages, newMessageReceived]);
    });
    // Cleanup function
    return () => {
      socket.off("message received");
    };
  }, [messages]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      // event.preventDefault();
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data, "data");
        socket.emit("new message", data); // emit new message event to server
        setMessages([...messages, data]);
        setNewMessage(" ");
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const userIsTypingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing Indicator Logic

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    //when to show typing is stopped
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              {/* Back Button & Sender Name */}
              <Flex
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
              >
                {/* Back Button */}
                <IconButton
                  icon={<ArrowBackIcon />}
                  onClick={() => setSelectedChat("")}
                  mr={2}
                />
                <Flex direction="column">
                  {/* Sender Name */}
                  <Text fontSize="xl" fontWeight="bold">
                    {getSenderName(user, selectedChat.users)}
                  </Text>

                  {isTyping && (
                    <Text fontSize="sm" color="gray.500" ml={1}>
                      Typing...
                    </Text>
                  )}
                </Flex>
              </Flex>
              {/* Profile Modal */}

              <ProfileModal user={getSenderInfo(user, selectedChat.users)} />
            </Flex>
          </Text>
          {/* Message Container */} 
          <Box
              position="relative"
              height="100vh"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
          >

         
          <Box
            maxHeight="calc(100vh - 100px)"
            p={3}
            bg="#E8E8E8"
            w="100%"
            //  h="100%"
            overflowY="auto"
            borderRadius="lg"
          >
            {/* Messages Here */}
            <Flex flexDirection="column" justifyContent="flex-end">
              {loading ? (
                <Spinner />
              ) : (
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              )}
            </Flex>
            {/* Input Container */}
            </Box>
            <Box
            position="fixed"
            bottom="0"
            right="0"
            left="0"
            bg="#F7F7F7"
            p="3"
            borderTop="1px solid #E0E0E0"
            >
              <FormControl onKeyDown={sendMessage}>
                <Input
                  variant="filled"
                //   bg="#E0E0E0"
                  bg="FFFFFF"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={userIsTypingHandler}
                />
              </FormControl>
            </Box>
            </Box>
        </>
      ) : (
        <Text fontSize="3xl" pb={3} >
          Click on a user to start chatting
        </Text>
      )}
    </>
  );
};

export default SelectedUserChat;
