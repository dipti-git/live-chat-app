import { Box, Text, HStack } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import UserListItem from "../User/UserListItem";
import { Tooltip } from "@chakra-ui/tooltip";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import LoadingChats from "../Chats/LoadingChats";
import { Spinner } from "@chakra-ui/spinner";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default form submission behavior
    handleSearch();
  }
};

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`/api/user?search=${search}`,  {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
  
      const { data } = await axios.post(`/api/chat`, { userId }, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box>
        <Flex
            justifyContent="space-between"
            alignItems="center"
            // bg="white"
            w="100%"
            // borderWidth="5px"
            // bg="green.500"
            bg="teal"
            p="2"
        >

        <Box bg="white" borderRadius="5px">
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        </Box>
        <HStack>

          <Box >
            <Menu>
              <MenuButton
                as={Button}
                bg="white"
                rightIcon={<ChevronDownIcon />}
              >
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  src={user.pic}
                />
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>{" "}
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </HStack>
        </Flex>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email" 
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                 onKeyDown={handleKeyDown} 
              />
              {/* <Button onClick={handleSearch}>Go</Button> */}
            </Box>
            {loading ? ( <LoadingChats /> ) : ( 
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
              )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
