import { VStack } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  InputGroup,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // SHow or hide the password
  const handleClick = () => setShow(!show);

  //Image upload to cloudinary
  const postDetails = (pictures) => {
    setLoading(true);
    if (pictures === undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pictures.type === "image/jpeg" || pictures.type === "image/png") {
      const data = new FormData();
      data.append("file", pictures);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dzzqq13ih");
      fetch("https://api.cloudinary.com/v1_1/dzzqq13ih/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password) {
      toast({
        title: "Please fill in the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    console.log(name, email, password, picture);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const signupDetails = { name, email, password, picture };
      const { data } = await axios.post("/api/user", signupDetails, config);

      console.log(data, "data");
      toast({
        title: "Signup Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      //after user is logged in, navigating to chat page
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "🫣" : "👀"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="picture">
        <FormLabel>Upload a picture</FormLabel>

        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
