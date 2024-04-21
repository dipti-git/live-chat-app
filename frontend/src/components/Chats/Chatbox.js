import { Box } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider"
import SelectedUserChat from "./SelectedUserChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {

  const { selectedChat } = ChatState();
    return (
        <Box  
        width="400px" height="700px"
        p={3}
        bg="#f5f5f5"
        w={{ base: "100%"}}
        borderRadius="lg"
        borderWidth="1px"
        >
         <SelectedUserChat  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
       </Box>
    )
}

export default Chatbox
