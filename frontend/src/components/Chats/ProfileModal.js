import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Center
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
  
      )}
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
         
          <ModalHeader
            fontSize="40px"
            fontFamily="Lato"
            d="flex"
            justifyContent="center"
          >
             <Center>
              {user.name}
             </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Center>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
               fallbackSrc="https://via.placeholder.com/150"
            />
            </Center>
            <Center>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Lato"
              marginTop="2rem" 
            >
              Email: {user.email}
            </Text>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;