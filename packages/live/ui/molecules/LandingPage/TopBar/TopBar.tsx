import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/core";
import { useUserQuery } from "@syra/gql-client";

interface Props {
  onClickSignUp: () => void;
  onClickLogIn: () => void;
}

function TopBar({onClickSignUp, onClickLogIn}: Props) {
  const {data, error, loading} = useUserQuery({variables: {id: 6}});

  return (
    <Box position={"fixed"} top={0} bg={"gray.900"} w={"100%"} h={'72px'} color={"white"} p={'16px'}
         boxShadow={"0px 3px 24px -5px rgba(0,0,0,1)"} zIndex={10}>
      <Box h={'32px'}>
        <Flex alignItems={"center"} justify={"space-between"}>
          <Box>
            <Text fontSize="lg" as={"span"} marginLeft={8} marginRight={12}>
              S Y R A
            </Text>
            <Button variant={"link"} marginX={4}>Studio</Button>
            <Button variant={"link"} marginX={4}>Pricing</Button>
            <Button variant={"link"} marginX={4}>FAQ</Button>
            <Button variant={"link"} marginX={4}>About</Button>
            <Button variant={"link"} marginX={4}>Community</Button>
            <Button variant={"link"} marginX={4}>Blog</Button>
          </Box>
          <Box>
            {!loading && !error && data && <Text marginX={4} display={'inline-block'}>{data.user.name}</Text>}
            <Button marginX={4} onClick={onClickLogIn}>Log in</Button>
            <Button onClick={onClickSignUp}>Sign up</Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default TopBar;
